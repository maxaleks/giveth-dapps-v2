import BigNumber from 'bignumber.js';
import config from '@/configuration';
import {
	FETCH_MAINNET_TOKEN_PRICE,
	FETCH_GNOSIS_TOKEN_PRICE,
} from './price.queries';

export const fetchMainnetTokenPrice = async (
	tokenId: string,
): Promise<string> => {
	const query = FETCH_MAINNET_TOKEN_PRICE;
	const variables = {
		tokenId: tokenId.toLowerCase(),
		daiId: '0x6b175474e89094c44da98b954eedeac495271d0f'.toLowerCase(),
	};
	const body = {
		query,
		variables,
	};
	const res = await fetch(config.MAINNET_CONFIG.uniswapV2Subgraph, {
		method: 'POST',
		body: JSON.stringify(body),
	});
	const data = await res.json();
	const tokenEthPrice = new BigNumber(data?.data?.token.derivedETH);
	const daiEthPrice = new BigNumber(data?.data?.daitoken.derivedETH);
	return tokenEthPrice.div(daiEthPrice).toString();
};

export const fetchGnosisTokenPrice = async (
	tokenId: string,
): Promise<string> => {
	const query = FETCH_GNOSIS_TOKEN_PRICE;
	const variables = {
		id: tokenId.toLowerCase(),
	};
	const subgraph = config.GNOSIS_CONFIG.uniswapV2Subgraph;
	if (!subgraph) {
		console.log('Subgraph is not defined');
		return '0';
	}
	const body = {
		query,
		variables,
	};
	const res = await fetch(subgraph, {
		method: 'POST',
		body: JSON.stringify(body),
	});
	const data = await res.json();
	return data?.data?.token?.derivedETH || '0';
};
