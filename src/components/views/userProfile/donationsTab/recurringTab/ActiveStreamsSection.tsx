import styled from 'styled-components';
import { B, H5, neutralColors } from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';
import { useUserStreams } from '@/hooks/useUserStreams';
import { StreamRow } from './StreamRow';

export const ActiveStreamsSection = () => {
	const tokenStream = useUserStreams();
	return (
		<Wrapper>
			<H5 weight={900}>My Active Streams</H5>
			<DonationTableContainer>
				<TableHeaderRow>
					<TableHeader>
						<B>Current stream Balance</B>{' '}
					</TableHeader>
					<TableHeader>
						<B>Total Recurring Donations</B>
					</TableHeader>
					<TableHeader>
						<B>Projects</B>
					</TableHeader>
					<TableHeader>
						<B>Runs out in</B>
					</TableHeader>
					<TableHeader>
						<B>Actions</B>
					</TableHeader>
				</TableHeaderRow>
				{Object.entries(tokenStream).map(([key, value]) => (
					<StreamRow key={key} tokenStream={value} />
				))}
			</DonationTableContainer>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	gap: 12px;
	background-color: ${neutralColors.gray[100]};
	padding: 26px 24px;
	border-radius: 12px;
`;

const DonationTableContainer = styled.div<{ myAccount?: boolean }>`
	display: grid;
	grid-template-columns: ${props =>
		props.myAccount
			? '1fr 4fr 1fr 1.5fr 1fr 1fr'
			: 'auto auto auto auto auto'};
	overflow: auto;
`;

const TableHeaderRow = styled.div`
	display: contents;
	& > *:first-child {
		border-radius: 12px 0 0 12px;
	}
	& > *:last-child {
		border-radius: 0 12px 12px 0;
	}
`;

export const TableCell = styled(Flex)`
	align-items: center;
	overflow-x: auto;
	gap: 8px;
	padding: 22px 24px;
`;

const TableHeader = styled(TableCell)`
	background-color: ${neutralColors.gray[200]};
`;