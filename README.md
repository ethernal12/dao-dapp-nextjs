                                        Decentralized autonomous organization (DAO) - Dapp 

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
- Admin deployes the contract with deadline, funding goal and minimun contribution parameters. At creation of the contract the Admin receives 1/3 of the token supply to their account.
- Everybody can contribute to the crowdfunding contract as long as the dadline date has not passed. If the funding goal has not been reached as the deadline date expires,      contributors can ask for a full refund.
- After contributing to the contract, contributor will receive DAOT tokens to their account.  
- Admin can create spending request proposals at any time.
- Only contributors who have DAOT in their account can vote for proposals, their vote weight is proportional to the amount of tokens they own.
- Owner can finalize the proposals if it has sufficient #votes(> 1/2) and the goal funding goal has been reached.
- Once proposalis finalized the requested funds for proposal are transfered to spending request receiving address.

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

