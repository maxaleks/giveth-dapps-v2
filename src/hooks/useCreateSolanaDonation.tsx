import { useEffect, useState } from 'react';
import { captureException } from '@sentry/nextjs';

import { useConnection } from '@solana/wallet-adapter-react';
import { SystemProgram } from '@solana/web3.js';
import { EDonationFailedType } from '@/components/modals/FailedDonation';
import { EDonationStatus } from '@/apollo/types/gqlEnums';
import { IOnTxHash, saveDonation, updateDonation } from '@/services/donation';
import { ICreateDonation } from '@/components/views/donate/helpers';
import { retryFetchTransaction } from '@/lib/transaction';
import { ChainType } from '@/types/config';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { postRequest } from '@/helpers/requests';

export const useCreateSolanaDonation = () => {
	const [txHash, setTxHash] = useState<string | undefined>();
	const [donationSaved, setDonationSaved] = useState<boolean>(false);
	const [donationMinted, setDonationMinted] = useState<boolean>(false);
	const [donationId, setDonationId] = useState<number>(0);
	const [resolveState, setResolveState] = useState<(() => void) | null>(null);
	const [createDonationProps, setCreateDonationProps] =
		useState<ICreateDonation>();
	const { sendNativeToken, walletChainType } = useGeneralWallet();
	const { connection: solanaConnection } = useConnection();

	const fetchTransaction = async ({ hash }: { hash: string }) => {
		const transaction = await solanaConnection.getTransaction(hash);
		const from: string =
			transaction?.transaction.message.accountKeys[0].toBase58()!;
		if (!from) {
			throw new Error('Solana transction from not found');
		}
		return {
			hash,
			chainId: 0,
			nonce: null,
			from,
		};
	};

	const handleSaveDonation = async (
		txHash: string,
		props: ICreateDonation,
	) => {
		let transaction;
		try {
			if (!txHash) {
				return;
			}
			transaction = await retryFetchTransaction(fetchTransaction, txHash);

			setTxHash(txHash);
			const {
				anonymous,
				projectId,
				chainvineReferred,
				amount,
				token,
				setFailedModalType,
			} = props;

			let donationData: IOnTxHash;

			if (transaction) {
				donationData = {
					chainId: transaction.chainId! || 0,
					txHash: transaction.hash,
					amount: amount,
					token,
					projectId,
					anonymous,
					nonce: transaction.nonce || 0,
					chainvineReferred,
					walletAddress: transaction.from,
					symbol: token.symbol,
					setFailedModalType,
					safeTransactionId: null,
				};
			} else return;

			console.log({ donationData });
			setCreateDonationProps(donationData);

			try {
				const id = await saveDonation({ ...donationData });
				setDonationId(id);
				setDonationSaved(true);
				return id;
			} catch (e: any) {
				await postRequest('/api/donation-backup', true, {
					chainId: transaction?.chainId!,
					txHash: transaction?.hash,
					amount: amount,
					token,
					projectId,
					anonymous,
					nonce: transaction?.nonce,
					chainvineReferred,
					walletAddress: transaction?.from,
					symbol: token.symbol,
					error: e.message,
				});
				setFailedModalType(EDonationFailedType.NOT_SAVED);
			}
		} catch (error) {
			console.log('Error sending transaction', { error });
		}
	};

	const handleError = (
		error: any,
		donationId: number,
		setFailedModalType: (type: EDonationFailedType) => void,
	) => {
		console.log('name', error.name);
		const localTxHash = error.replacement?.hash || error.transactionHash;
		setTxHash(localTxHash);

		if (error.name === 'TransactionExecutionError') {
			setFailedModalType(EDonationFailedType.FAILED);
		} else {
			console.log('Rejected1', error);
			setFailedModalType(EDonationFailedType.REJECTED);
		}

		setDonationSaved(false);
		updateDonation(donationId, EDonationStatus.FAILED);
		captureException(error, { tags: { section: 'confirmDonation' } });
	};

	const createDonation = async (props: ICreateDonation) => {
		const {
			walletAddress: toAddress,
			amount,
			token,
			setFailedModalType,
		} = props;
		const { address, chainType } = token;

		if (chainType !== ChainType.SOLANA) {
			throw new Error('Invalid token chain type');
		}

		if (walletChainType !== ChainType.SOLANA) {
			throw new Error('Invalid wallet chain type');
		}

		if (address !== SystemProgram.programId.toBase58()) {
			throw new Error(
				'Token address is not native token address - not supported yet!',
			);
		}

		const transactionObj = {
			to: toAddress! as `0x${string}`,
			value: amount.toString(),
		};

		try {
			// setDonating(true);
			const hash = await sendNativeToken(toAddress!, amount.toString());
			console.log('HERE IS THE hash', hash);
			if (!hash) {
				updateDonation(donationId, EDonationStatus.FAILED);
				return { isSaved: false, txHash: '', isMinted: false };
			}
			setTxHash(hash);
			const id = await handleSaveDonation(hash, props);
			// Wait for the status to become 'success'
			if (!id) {
				return {
					isSaved: false,
					txHash: hash,
					isMinted: status === 'success',
				};
			}
			return {
				isSaved: id > 0,
				txHash: hash,
			};
		} catch (error: any) {
			handleError(error, 0, setFailedModalType); // Assuming donationId as 0 for this case
			return { isSaved: false, txHash: '', isMinted: false };
		}
	};

	useEffect(() => {
		if (status === 'success') {
			updateDonation(donationId, EDonationStatus.VERIFIED);
			setDonationMinted(true);
			if (resolveState) {
				resolveState();
				setResolveState(null); // clear the state to avoid calling it again
			}
		}
		const comingFromSafe = txHash;
		if (status === 'error' && !comingFromSafe) {
			updateDonation(donationId, EDonationStatus.FAILED);
			setDonationSaved(false);
			createDonationProps?.setFailedModalType(EDonationFailedType.FAILED);
		}
	}, [donationId]);

	return {
		txHash,
		donationSaved,
		createDonation,
		donationMinted,
	};
};