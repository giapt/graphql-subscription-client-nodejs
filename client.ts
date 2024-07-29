import { createClient } from 'graphql-ws';
import { print } from 'graphql/language/printer';
import { parse } from 'graphql';
import WebSocket from 'ws';

const subscriptionQuery = parse(`
  subscription MyQuery {
    deposits(limit: 1, orderBy: depositId_DESC) {
      amount
      blockHeight
      chainId
      depositId
      id
      txHash
      tokenAddress
      unlockTime
      withdrawalAddress
    }
  }
`);

const client = createClient({
  url: 'ws://localhost:4352/graphql',
  webSocketImpl: WebSocket,
  keepAlive: 0
});

(async () => {
  const onNext = (data: any) => {
    console.log('Received data:', data.data);
  };

  const onError = (error: any) => {
    console.error('Subscription error:', error);
  };

  const onComplete = () => {
    console.log('Subscription complete');
  };

  const result = await client.subscribe(
    {
      query: print(subscriptionQuery),
    },
    {
      next: onNext,
      error: onError,
      complete: onComplete,
    }
  );

  console.log('Subscription initiated:', result);
})();