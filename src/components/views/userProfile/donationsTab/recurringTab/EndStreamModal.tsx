import {
	Flex,
	H3,
	IconAlertTriangleOutline32,
	P,
	mediaQueries,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useState, type FC } from 'react';
import styled from 'styled-components';
import { Framework } from '@superfluid-finance/sdk-core';
import { useAccount } from 'wagmi';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { ActionButton } from './ModifyStreamModal/ModifyStreamInnerModal';
import config, { isProduction } from '@/configuration';
import { IWalletRecurringDonation } from '@/apollo/types/types';
import { getEthersProvider, getEthersSigner } from '@/helpers/ethers';
import { wagmiConfig } from '@/wagmiConfigs';
import { endRecurringDonation } from '@/services/donation';
import { showToastError } from '@/lib/helpers';

enum EEndStreamSteps {
	CONFIRM,
	ENDING,
	SUCCESS,
}

export interface IEndStreamModalProps extends IModal {
	donation: IWalletRecurringDonation;
	refetch: () => void;
}

export const EndStreamModal: FC<IEndStreamModalProps> = ({ ...props }) => {
	const { isAnimating, closeModal } = useModalAnimation(props.setShowModal);
	const { formatMessage } = useIntl();

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({
				id: 'label.end_recurring_donation',
			})}
			headerTitlePosition='left'
			headerIcon={<IconAlertTriangleOutline32 />}
		>
			<EndStreamInnerModal {...props} />
		</Modal>
	);
};

interface IEndStreamInnerModalProps extends IEndStreamModalProps {}

const EndStreamInnerModal: FC<IEndStreamInnerModalProps> = ({
	setShowModal,
	donation,
	refetch,
}) => {
	const [step, setStep] = useState(EEndStreamSteps.CONFIRM);
	const { formatMessage } = useIntl();
	const { address } = useAccount();

	const onDeleteStream = async () => {
		setStep(EEndStreamSteps.ENDING);
		try {
			if (!donation.project.anchorContracts.length) {
				throw new Error('Project Anchor contract address not found');
			}

			if (!address) {
				throw new Error('Please connect your wallet first');
			}

			const _superToken = config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS.find(
				s => s.underlyingToken.symbol === donation.currency,
			);
			if (!_superToken) {
				throw new Error('SuperToken not found');
			}
			const provider = await getEthersProvider(wagmiConfig);
			const signer = await getEthersSigner(wagmiConfig);
			if (!provider || !signer)
				throw new Error('Provider or signer not found');

			const _options = {
				chainId: config.OPTIMISM_CONFIG.id,
				provider: provider,
				resolverAddress: isProduction
					? undefined
					: '0x554c06487bEc8c890A0345eb05a5292C1b1017Bd',
			};
			const sf = await Framework.create(_options);

			let superToken;
			if (_superToken.symbol === 'ETHx') {
				superToken = await sf.loadNativeAssetSuperToken(_superToken.id);
			} else {
				superToken = await sf.loadWrapperSuperToken(_superToken.id);
			}

			const deleteOp = superToken.deleteFlow({
				sender: address,
				receiver: donation.project.anchorContracts[0].address,
			});

			const tx = await deleteOp.exec(signer);

			try {
				const info = {
					projectId: +donation.project.id,
					chainId: config.OPTIMISM_NETWORK_NUMBER,
					txHash: tx.hash,
					superToken: _superToken,
				};
				const projectBackendRes = await endRecurringDonation(info);
				console.log('Project Donation End Info', projectBackendRes);
				refetch();
			} catch (error) {
				showToastError(error);
			}

			const res = await tx.wait();
			if (!res.status) {
				throw new Error('Transaction failed');
			}
			setStep(EEndStreamSteps.SUCCESS);
		} catch (error: any) {
			setStep(EEndStreamSteps.CONFIRM);
			if (error?.code !== 'ACTION_REJECTED') {
				showToastError(error);
			}
			console.log('Error on recurring donation', { error });
		}
	};

	return step === EEndStreamSteps.CONFIRM ||
		step === EEndStreamSteps.ENDING ? (
		<Wrapper>
			<InlineToast
				type={EToastType.Error}
				message={formatMessage({
					id: 'component.end_stream_modal.confirm_question',
				})}
			/>
			<Flex gap='16px'>
				<ActionButton
					label={formatMessage({ id: 'label.cancel' })}
					onClick={() => setShowModal(false)}
					buttonType='texty-gray'
					disabled={step === EEndStreamSteps.ENDING}
				/>
				<ActionButton
					label={formatMessage({ id: 'label.confirm' })}
					onClick={() => onDeleteStream()}
					disabled={step === EEndStreamSteps.ENDING}
					loading={step === EEndStreamSteps.ENDING}
				/>
			</Flex>
		</Wrapper>
	) : (
		<Wrapper>
			<H3 weight={700}>
				{formatMessage({
					id: 'component.end_stream_modal.ended_title',
				})}
			</H3>
			<P>
				{formatMessage(
					{
						id: 'component.end_stream_modal.ended_description',
					},
					{
						name: donation.project.title,
					},
				)}
			</P>
			<ActionButton
				label={formatMessage({ id: 'label.done' })}
				onClick={() => {
					setShowModal(false);
				}}
			/>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	text-align: left;
	flex-direction: column;
	align-items: stretch;
	justify-content: stretch;
	gap: 16px;
	width: 100%;
	padding: 16px 24px 24px 24px;
	${mediaQueries.tablet} {
		width: 530px;
	}
`;