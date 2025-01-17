import { gql } from '@apollo/client';

export const PROJECT_CORE_FIELDS = gql`
	fragment ProjectCoreFields on Project {
		__typename
		id
		title
		image
		slug
		verified
		totalDonations
		qfRounds {
			id
			name
			isActive
			beginDate
			endDate
			maximumReward
			allocatedTokenSymbol
			allocatedFundUSDPreferred
			allocatedFundUSD
		}
	}
`;

export const PROJECT_CARD_FIELDS = gql`
	${PROJECT_CORE_FIELDS}
	fragment ProjectCardFields on Project {
		...ProjectCoreFields
		descriptionSummary
		totalReactions
		reaction {
			id
			userId
		}
		adminUser {
			name
			walletAddress
			avatar
		}
		updatedAt
		organization {
			label
		}
		projectPower {
			powerRank
			totalPower
			round
		}
		sumDonationValueUsdForActiveQfRound
		sumDonationValueUsd
		countUniqueDonorsForActiveQfRound
		countUniqueDonors
		estimatedMatching {
			projectDonationsSqrtRootSum
			allProjectsSum
			matchingPool
		}
		anchorContracts {
			address
			isActive
		}
	}
`;

export const FETCH_ALL_PROJECTS = gql`
	${PROJECT_CARD_FIELDS}
	query FetchAllProjects(
		$limit: Int
		$skip: Int
		$sortingBy: SortingField
		$filters: [FilterField!]
		$searchTerm: String
		$category: String
		$mainCategory: String
		$campaignSlug: String
		$connectedWalletUserId: Int
		$qfRoundSlug: String
	) {
		allProjects(
			limit: $limit
			skip: $skip
			sortingBy: $sortingBy
			filters: $filters
			searchTerm: $searchTerm
			category: $category
			mainCategory: $mainCategory
			campaignSlug: $campaignSlug
			connectedWalletUserId: $connectedWalletUserId
			qfRoundSlug: $qfRoundSlug
		) {
			projects {
				...ProjectCardFields
			}
			totalCount
		}
	}
`;

export const FETCH_PROJECT_BY_SLUG_VERIFICATION = gql`
	query ProjectBySlug($slug: String!, $connectedWalletUserId: Int) {
		projectBySlug(
			slug: $slug
			connectedWalletUserId: $connectedWalletUserId
		) {
			id
			status {
				name
			}
			adminUser {
				walletAddress
			}
		}
	}
`;

export const FETCH_PROJECT_BY_SLUG_SUCCESS = gql`
	query ProjectBySlug($slug: String!, $connectedWalletUserId: Int) {
		projectBySlug(
			slug: $slug
			connectedWalletUserId: $connectedWalletUserId
		) {
			id
			title
			image
			slug
			descriptionSummary
			adminUser {
				id
				name
				walletAddress
				avatar
			}
		}
	}
`;

export const FETCH_PROJECT_BY_SLUG_DONATION = gql`
	query ProjectBySlug($slug: String!, $connectedWalletUserId: Int) {
		projectBySlug(
			slug: $slug
			connectedWalletUserId: $connectedWalletUserId
		) {
			id
			title
			image
			slug
			descriptionSummary
			verified
			sumDonationValueUsd
			sumDonationValueUsdForActiveQfRound
			countUniqueDonorsForActiveQfRound
			adminUser {
				id
				name
				walletAddress
				avatar
			}
			organization {
				label
				supportCustomTokens
			}
			addresses {
				address
				isRecipient
				networkId
				chainType
			}
			status {
				name
			}
			estimatedMatching {
				projectDonationsSqrtRootSum
				allProjectsSum
				matchingPool
			}
			qfRounds {
				id
				name
				isActive
				beginDate
				endDate
				eligibleNetworks
				maximumReward
				allocatedTokenSymbol
				allocatedFundUSDPreferred
				allocatedFundUSD
			}
			anchorContracts {
				address
				isActive
			}
		}
	}
`;

export const FETCH_PROJECT_BY_SLUG_SINGLE_PROJECT = gql`
	query ProjectBySlug($slug: String!, $connectedWalletUserId: Int) {
		projectBySlug(
			slug: $slug
			connectedWalletUserId: $connectedWalletUserId
		) {
			__typename
			id
			title
			image
			slug
			verified
			totalDonations
			description
			addresses {
				address
				isRecipient
				networkId
				chainType
			}
			socialMedia {
				type
				link
			}
			totalProjectUpdates
			creationDate
			reaction {
				id
				userId
			}
			totalReactions
			categories {
				name
				value
				mainCategory {
					title
				}
			}
			adminUser {
				id
				name
				walletAddress
				avatar
			}
			listed
			status {
				id
				name
			}
			organization {
				name
				label
				supportCustomTokens
			}
			verificationFormStatus
			projectPower {
				powerRank
				totalPower
				round
			}
			projectFuturePower {
				totalPower
				powerRank
				round
			}
			givbackFactor
			sumDonationValueUsdForActiveQfRound
			sumDonationValueUsd
			countUniqueDonorsForActiveQfRound
			countUniqueDonors
			estimatedMatching {
				projectDonationsSqrtRootSum
				allProjectsSum
				matchingPool
			}
			qfRounds {
				id
				name
				isActive
				beginDate
				endDate
				eligibleNetworks
				maximumReward
				allocatedTokenSymbol
				allocatedFundUSDPreferred
				allocatedFundUSD
			}
			campaigns {
				id
				title
			}
			anchorContracts {
				address
				isActive
			}
		}
	}
`;

export const FETCH_PROJECT_BY_ID = gql`
	query ProjectById($id: Float!) {
		projectById(id: $id) {
			id
			title
			image
			description
			addresses {
				address
				isRecipient
				networkId
				chainType
			}
			socialMedia {
				type
				link
			}
			impactLocation
			categories {
				name
				value
			}
			adminUser {
				walletAddress
			}
			status {
				name
			}
			slug
			anchorContracts {
				address
				isActive
			}
		}
	}
`;

export const FETCH_GIVETH_PROJECT_BY_ID = gql`
	query ProjectById($id: Float!) {
		projectById(id: $id) {
			addresses {
				address
				isRecipient
				networkId
				chainType
			}
			slug
		}
	}
`;

export const FETCH_PROJECT_REACTION_BY_ID = gql`
	query ProjectById($id: Float!, $connectedWalletUserId: Int) {
		projectById(id: $id, connectedWalletUserId: $connectedWalletUserId) {
			id
			reaction {
				id
				userId
			}
			totalReactions
		}
	}
`;

export const FETCH_PROJECT_UPDATES = gql`
	query GetProjectUpdates(
		$projectId: Int!
		$take: Int!
		$skip: Int!
		$connectedWalletUserId: Int
		$orderBy: OrderBy
	) {
		getProjectUpdates(
			projectId: $projectId
			take: $take
			skip: $skip
			connectedWalletUserId: $connectedWalletUserId
			orderBy: $orderBy
		) {
			id
			title
			projectId
			createdAt
			userId
			content
			isMain
			totalReactions
			reaction {
				projectUpdateId
				userId
			}
		}
	}
`;

export const FETCH_FEATURED_UPDATE_PROJECTS = gql`
	${PROJECT_CARD_FIELDS}
	query fetchFeaturedProjects(
		$limit: Int
		$skip: Int
		$connectedWalletUserId: Int
	) {
		featuredProjects(
			limit: $limit
			skip: $skip
			connectedWalletUserId: $connectedWalletUserId
		) {
			projects {
				...ProjectCardFields
			}
			totalCount
		}
	}
`;

export const FETCH_FEATURED_PROJECT_UPDATES = gql`
	query featuredProjectUpdate($projectId: Int!) {
		featuredProjectUpdate(projectId: $projectId) {
			id
			title
			projectId
			userId
			content
			isMain
			totalReactions
			createdAt
		}
	}
`;

export const ADD_PROJECT_UPDATE = gql`
	mutation ($projectId: Float!, $title: String!, $content: String!) {
		addProjectUpdate(
			projectId: $projectId
			title: $title
			content: $content
		) {
			id
			projectId
			userId
			content
		}
	}
`;

export const DELETE_PROJECT_UPDATE = gql`
	mutation DeleteProjectUpdate($updateId: Float!) {
		deleteProjectUpdate(updateId: $updateId)
	}
`;

export const EDIT_PROJECT_UPDATE = gql`
	mutation EditProjectUpdate(
		$content: String!
		$title: String!
		$updateId: Float!
	) {
		editProjectUpdate(
			content: $content
			title: $title
			updateId: $updateId
		) {
			id
			title
			projectId
			userId
			content
			createdAt
			isMain
		}
	}
`;

export const FETCH_USER_LIKED_PROJECTS = gql`
	${PROJECT_CARD_FIELDS}
	query FetchUserLikedProjects($take: Int, $skip: Int, $userId: Int!) {
		likedProjectsByUserId(take: $take, skip: $skip, userId: $userId) {
			projects {
				...ProjectCardFields
			}
			totalCount
		}
	}
`;

export const UPLOAD_IMAGE = gql`
	mutation ($imageUpload: ImageUpload!) {
		uploadImage(imageUpload: $imageUpload) {
			url
			projectId
			projectImageId
		}
	}
`;

export const WALLET_ADDRESS_IS_VALID = gql`
	query WalletAddressIsValid($address: String!) {
		walletAddressIsValid(address: $address)
	}
`;

export const CREATE_PROJECT = gql`
	mutation ($project: CreateProjectInput!) {
		createProject(project: $project) {
			id
			title
			description
			adminUserId
			adminUser {
				name
				walletAddress
				avatar
			}
			image
			impactLocation
			slug
			addresses {
				address
				networkId
				chainType
			}
			categories {
				name
				value
			}
			socialMedia {
				type
				link
			}
		}
	}
`;

export const UPDATE_PROJECT = gql`
	mutation ($projectId: Float!, $newProjectData: UpdateProjectInput!) {
		updateProject(projectId: $projectId, newProjectData: $newProjectData) {
			id
			title
			description
			image
			slug
			creationDate
			adminUserId
			adminUser {
				name
				walletAddress
				avatar
			}
			addresses {
				address
				networkId
				chainType
			}
			impactLocation
			categories {
				name
				value
			}
			socialMedia {
				type
				link
			}
		}
	}
`;

export const ADD_RECIPIENT_ADDRESS_TO_PROJECT = gql`
	mutation (
		$projectId: Float!
		$networkId: Float!
		$address: String!
		$chainType: ChainType
	) {
		addRecipientAddressToProject(
			projectId: $projectId
			networkId: $networkId
			address: $address
			chainType: $chainType
		) {
			id
			title
			description
			descriptionSummary
			image
			slug
			listed
			reviewStatus
			verified
			slugHistory
			creationDate
			adminUserId
			walletAddress
			impactLocation
			categories {
				name
			}
			addresses {
				address
				isRecipient
				networkId
				chainType
			}
			adminUser {
				id
				name
				email
				walletAddress
			}
			addresses {
				address
				isRecipient
				networkId
				chainType
			}
		}
	}
`;

export const LIKE_PROJECT_MUTATION = gql`
	mutation ($projectId: Int!) {
		likeProject(projectId: $projectId) {
			id
			projectId
			reaction
			userId
		}
	}
`;

export const UNLIKE_PROJECT_MUTATION = gql`
	mutation ($reactionId: Int!) {
		unlikeProject(reactionId: $reactionId)
	}
`;

export const GET_STATUS_REASONS = gql`
	query {
		getStatusReasons(statusId: 6) {
			id
			description
			status {
				id
				name
			}
		}
	}
`;

export const DEACTIVATE_PROJECT = gql`
	mutation ($projectId: Float!, $reasonId: Float) {
		deactivateProject(projectId: $projectId, reasonId: $reasonId)
	}
`;

export const ACTIVATE_PROJECT = gql`
	mutation ($projectId: Float!) {
		activateProject(projectId: $projectId)
	}
`;

export const TITLE_IS_VALID = `
	query IsValidTitleForProject($title: String!, $projectId: Float) {
		isValidTitleForProject(title: $title, projectId: $projectId)
	}
`;

export const PROJECT_ACCEPTED_TOKENS = gql`
	query GetProjectAcceptTokens($projectId: Float!) {
		getProjectAcceptTokens(projectId: $projectId) {
			id
			symbol
			networkId
			chainType
			address
			name
			decimals
			mainnetAddress
			isGivbackEligible
			order
			isStableCoin
			coingeckoId
		}
	}
`;

export const SIMILAR_PROJECTS = gql`
	${PROJECT_CARD_FIELDS}
	query SimilarProjectsBySlug($slug: String!, $take: Int, $skip: Int) {
		similarProjectsBySlug(slug: $slug, take: $take, skip: $skip) {
			projects {
				...ProjectCardFields
			}
		}
	}
`;

export const FETCH_MAIN_CATEGORIES = gql`
	query {
		mainCategories {
			title
			banner
			slug
			description
			categories {
				name
				value
				isActive
			}
		}
	}
`;

export const FETCH_RECURRING_DONATIONS_BY_PROJECTID = gql`
	query (
		$take: Int
		$skip: Int
		$projectId: Int!
		$searchTerm: String
		$status: String
		$finishStatus: FinishStatus
		$orderBy: RecurringDonationSortBy
		$includeArchived: Boolean
	) {
		recurringDonationsByProjectId(
			take: $take
			skip: $skip
			projectId: $projectId
			searchTerm: $searchTerm
			status: $status
			finishStatus: $finishStatus
			orderBy: $orderBy
			includeArchived: $includeArchived
		) {
			recurringDonations {
				id
				txHash
				networkId
				currency
				anonymous
				status
				amountStreamed
				totalUsdStreamed
				flowRate
				txHash
				donor {
					id
					walletAddress
					name
					email
					avatar
				}
				createdAt
			}
			totalCount
		}
	}
`;
