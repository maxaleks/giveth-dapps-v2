import { Caption, neutralColors } from '@giveth/ui-design-system';
import { type FC } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { type GetBalanceReturnType } from '@wagmi/core';
import { ONE_MONTH_SECONDS } from '@/lib/constants/constants';
import { limitFraction } from '@/helpers/number';
import { Flex } from '@/components/styled-components/Flex';
import { ISuperToken, ISuperfluidStream } from '@/types/superFluid';

interface IStreamInfoProps {
	tokenStreams: ISuperfluidStream[];
	superToken?: ISuperToken;
	SuperTokenBalance?: GetBalanceReturnType;
}

export const StreamInfo: FC<IStreamInfoProps> = ({
	tokenStreams,
	superToken,
	SuperTokenBalance,
}) => {
	const { formatMessage } = useIntl();
	const totalStreamPerSec =
		tokenStreams?.reduce(
			(acc, stream) => acc + BigInt(stream.currentFlowRate),
			0n,
		) || 0n;
	const streamRunOutInMonth =
		SuperTokenBalance !== undefined &&
		totalStreamPerSec > 0 &&
		SuperTokenBalance.value > 0n
			? SuperTokenBalance.value / totalStreamPerSec / ONE_MONTH_SECONDS
			: 0n;

	return (
		<StreamSection>
			<Flex alignItems='center' justifyContent='space-between'>
				<Caption medium>
					{formatMessage({
						id: 'label.stream_balance',
					})}
				</Caption>
				<StreamBalanceInfo medium>
					{limitFraction(SuperTokenBalance?.formatted || '0')}{' '}
					{superToken?.symbol}
				</StreamBalanceInfo>
			</Flex>
			<Flex alignItems='center' justifyContent='space-between'>
				<Caption>
					{formatMessage({
						id: 'label.balance_runs_out_in',
					})}{' '}
					<strong>
						{streamRunOutInMonth.toString()}{' '}
						{formatMessage(
							{
								id: 'label.months',
							},
							{
								count: streamRunOutInMonth.toString(),
							},
						)}
					</strong>
				</Caption>
				<Caption>
					{formatMessage({ id: 'label.funding' })}{' '}
					<strong>{tokenStreams.length}</strong>{' '}
					{formatMessage(
						{ id: 'label.project' },
						{
							count: tokenStreams.length,
						},
					)}
				</Caption>
			</Flex>
		</StreamSection>
	);
};

const StreamSection = styled(Flex)`
	flex-direction: column;
	padding: 8px;
	gap: 16px;
	border-radius: 8px;
	background-color: ${neutralColors.gray[200]};
	margin-top: 16px;
	color: ${neutralColors.gray[800]};
`;

const StreamBalanceInfo = styled(Caption)`
	background-color: ${neutralColors.gray[300]};
	border-radius: 8px;
	padding: 2px 8px;
`;