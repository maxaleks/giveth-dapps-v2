import {
	brandColors,
	Container,
	H2,
	H3,
	H5,
	Subline,
} from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';
import { Row } from '../../styled-components/Grid';
import { IUser } from '@/apollo/types/types';

export interface IUserPublicProfileView {
	user: IUser;
}

const PublicProfileContributeCard: FC<IUserPublicProfileView> = ({ user }) => {
	return (
		<Container>
			<UserContributeTitle
				weight={700}
			>{`${user.name}’s donations & projects`}</UserContributeTitle>
			<ContributeCardContainer>
				<ContributeCard>
					<ContributeCardTitles>donations</ContributeCardTitles>
					<ContributeCardTitles>
						Total amount donated
					</ContributeCardTitles>
					<H2>{user.donationsCount}</H2>
					<H5>${user.totalDonated}</H5>
				</ContributeCard>
				<ContributeCard>
					<ContributeCardTitles>Projects</ContributeCardTitles>
					<ContributeCardTitles>
						Donation received
					</ContributeCardTitles>
					<H2>{user.projectsCount}</H2>
					<H5>${user.totalReceived}</H5>
				</ContributeCard>
			</ContributeCardContainer>
		</Container>
	);
};

const UserContributeTitle = styled(H5)`
	margin-bottom: 16px;
`;

const ContributeCardContainer = styled(Row)`
	gap: 32px;
`;

const ContributeCard = styled.div`
	background: ${brandColors.giv['000']};
	box-shadow: 0px 3px 20px rgba(212, 218, 238, 0.4);
	border-radius: 12px;
	display: grid;
	padding: 24px;
	width: 556px;
	grid-template-columns: 1fr 1fr;
`;

const ContributeCardTitles = styled(Subline)`
	text-transform: uppercase;
`;

export default PublicProfileContributeCard;