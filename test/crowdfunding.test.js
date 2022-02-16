//const web3 = require('web3');
const { assert } = require("chai");

const { expectRevert, time } = require('@openzeppelin/test-helpers');
const { web3 } = require("@openzeppelin/test-helpers/src/setup");



const CF = artifacts.require('CrowdFunding')


contract("voting DApp", accounts => {
    const [admin, voter1, voter2, voter3, recipient, admin2] = [accounts[0], accounts[1], accounts[2], accounts[3], accounts[4], accounts[5]];
    const [spendingRequest1, spendingRequest2] = [0, 1]
    const voters = [accounts[1], accounts[2], accounts[3]]



    //-----------------------helper functions----------------------------
    const toBN = value => web3.utils.toBN(value)
    const toWei = value => toBN(web3.utils.toWei(value, "ether"))



    const getGas = async result => {

        const txHash = await web3.eth.getTransaction(result.tx)
        const gasUsed = toBN(result.receipt.gasUsed)
        const gasPrice = toBN(txHash.gasPrice)

        const gas = gasUsed.mul(gasPrice)

        return gas
    }

    const getBalance = async address => web3.eth.getBalance(address)

    const getBalances = async addresses => {

        const getBalances = await Promise.all(addresses.map(address =>
            web3.eth.getBalance(address)
        ))
        return getBalances.map(balance => toBN(balance))
    }

    const getTokenBalances = async addresses => {
        const getTokens = await Promise.all(addresses.map(address =>
            cf.balanceOfDaotAddr(address)
        ))
        return getTokens.map(balance => toBN(balance))


    }

    //-----------------------/helper functions----------------------------


    //-----------------------constructor parameters-----------------------
    const deadline = 1000;              // 1000 sec.
    const goal = toWei("0.3")
    const minCon = toWei("0.1")
    //-----------------------/constructor parameters-----------------------


    //spending request
    const title = "new office"
    const description = "new office"

    let cf = null
    let cf2 = null


    before(async () => {

        cf = await CF.new(deadline, goal, minCon)


    })

    describe("Check minted token balances", () => {

        it("owner should have 2/3 of minted tokens", async () => {
            const totalTokenSupply = await cf.totalSupply()
            const tokenContractAddress = await cf.tokenHolderAddress()
            const tokenContractBalance = await cf.balanceOfDaotAddr(tokenContractAddress)



            assert.equal(Math.trunc(toBN(totalTokenSupply) * 2 / 3), toBN(tokenContractBalance).toString(), "Token balance of contract owner do not match")


        })

        it("admin should have 1/3 of minted tokens", async () => {
            const totalTokenSupply = await cf.totalSupply()
            const adminTokenBalance = await cf.balanceOfDaotAddr(admin)



            assert.equal(Math.trunc(toBN(totalTokenSupply) * 1 / 3), toBN(adminTokenBalance).toString(), "Token balance of admin do not match")


        })

    })

    describe("Contribute", () => {



        it("can contribute if >= minimum contribution", async () => {


            const underMinCon = toBN(minCon).sub(toBN("10000"))
            await expectRevert(cf.contribute({ from: voter1, value: underMinCon }),
                "Minimum contribution not met!"

            )

        })

        it("can contribute", async () => {

            const totalTokenSupply = await cf.totalSupply()

            const balancesBefore = await getBalances(voters)

            const txs = await Promise.all(voters.map(voter =>
                cf.contribute({
                    from: voter,
                    value: minCon
                }),

            ))

            const tokenBalanceAfterCon = await getTokenBalances(voters);



            let gasUsed = []
            for (let i = 0; i < txs.length; i++) {
                gasUsed.push(await getGas(txs[i]))
            }


            const balancesAfter = await getBalances(voters)

            const conValue1 = await cf.contributors(voter1)
            const conValue2 = await cf.contributors(voter2)
            const conValue3 = await cf.contributors(voter3)


            // const result = voters.some((_voter, i) => {
            //    console.log(i)
            //     return balancesBefore[i].sub(toBN(minCon)).sub(gasUsed[i]).eq(balancesAfter[i]) 

            // })

            let j = 0
            for (let i = 0; i < voters.length; i++) {

                if (
                    balancesBefore[i].sub(toBN(minCon)).sub(gasUsed[i]).eq(balancesAfter[i])) {
                    j++

                } else {
                    break
                }

            }

           
            // assert.equal(tokenBalanceAfterCon.map(tokenBalance =>

            //     (tokenBalance.toString(), Math.round((toWei(minCon).toString() / 10 ** 28)), "error")

            // ))
            for (let i = 0; i < tokenBalanceAfterCon.length; i++) {
                assert.equal(tokenBalanceAfterCon[i].toString(), (Math.round((toWei(minCon).toString() / 10 ** 29))).toString()) // 10**18 to get rid of the decimals + 10**11 to convert to tokens price from wei


            }
            assert.equal(j, voters.length)
            assert.equal(conValue1.toString(), minCon)
            assert.equal(conValue2.toString(), minCon)
            assert.equal(conValue3.toString(), minCon)



        })




    })
    describe("Create spending request", () => {



        it("only admin can create new spending request", async () => {
            await expectRevert(
                cf.spendingRequest(title, description, recipient, minCon, { from: voter1 }),
                "Only admin!"
            )

        })

        it("cannot create spending request with value > raisedAmount", async () => {
            let raisedAmount = await cf.raisedAmount()
            const overRaisedAmount = toBN(raisedAmount).add(toBN("10000"))


            await expectRevert(
                cf.spendingRequest(title, description, recipient, overRaisedAmount, { from: admin }),
                "Not enough funds raised for this requested proposal!"
            )

        })
        it("create spending request", async () => {
            await cf.spendingRequest(title, description, recipient, minCon, { from: admin })

            const getSpendingRequest = await cf.getSpendingRequest(0)


            assert.equal(getSpendingRequest[1], description, "Spending request descriptions do NOT match");
            assert.equal(getSpendingRequest[2], title, "Spending request titles do NOT match");
            assert.equal(getSpendingRequest[3].toString(), minCon, "Spending request minimum contributions do NOT match");
            assert.equal(getSpendingRequest[4].toString(), recipient, "Spending request recipient addresses do NOT match");
            assert.equal(getSpendingRequest[5].toString(), 0, "Spending request votes should be 0 ");
            assert.equal(getSpendingRequest[6], false, "Spending request should not be completed yet");
        })


    })

    describe("Spending request voting", () => {


        

        
        it("only token holders can vote for spending request", async () => {
            await expectRevert(
                cf.vote(spendingRequest1, { from: recipient }),
                "Your address does NOT have any tokens, no voting rights!"

            )

        })

        it("can vote", async () => {

         
            
            await Promise.all(voters.map(voter =>
                cf.vote(spendingRequest1, {
                    from: voter,
                }),

            ))

            const vote1 = await cf.votedForSpendingRequest(spendingRequest1, { from: voter1 })
            const vote2 = await cf.votedForSpendingRequest(spendingRequest1, { from: voter2 })
            const vote3 = await cf.votedForSpendingRequest(spendingRequest1, { from: voter3 })

            assert.equal(vote1, true, "voter1 should have voted for spendingRequest1");
            assert.equal(vote2, true, "voter2 should have voted for spendingRequest2");
            assert.equal(vote3, true, "voter3 should have voted for spendingRequest3");

        })

        it("can only vote once", async () => {
            await expectRevert(cf.vote(spendingRequest1, { from: voter1 }),
                "You have allready voted for this spending request!"


            )

        })
        it("can only vote if spending request is not completed", async () => {
            
            await cf.transferRequestFunds(spendingRequest1, {from:admin})
            await cf.contribute({from:recipient, value:minCon})

            await expectRevert(cf.vote(spendingRequest1, { from: recipient }),
                "Cannot vote, spending request completed!"

            )

        })
        


    })

    describe("Transfer funds", () => {

        before(async () => {
            //create new contract
            cf2 = await CF.new(deadline, goal, minCon)


            //contribute to contract
            await Promise.all(voters.map(voter =>
                cf2.contribute({
                    from: voter,
                    value: minCon
                }),

            ))

            //create new spending proposal
            cf2.spendingRequest(title, description, recipient, minCon, { from: admin })

            //vote for that proposal
            await Promise.all(voters.map(voter =>
                cf2.vote(spendingRequest1, {
                    from: voter,
                }),

            ))



        })
        it("only admin can transfer request funds", async () => {

            await expectRevert(
                cf2.transferRequestFunds(spendingRequest1, { from: voter1 }),
                "Only admin!"

            )

        })

        it("can transfer funds only if spending request has > 1/2 votes from contributors", async () => {
            //create new spending request with no votes
            await cf2.spendingRequest(title, description, recipient, minCon, { from: admin })

            await expectRevert(
                cf2.transferRequestFunds(spendingRequest2, { from: admin }),
                "The request has not received more than half of votes!"

            )

        })
        it("cannot contribute if contribution deadline has expired", async () => {
            await time.increase(1001);

            await expectRevert(cf2.contribute({ from: voter1, value: minCon }),
                "The campaign contribution deadline ended!"

            )

        })

        it("can transfer request funds", async () => {
            // get the value that recipient has to recieve
            const getSpendingRequest = await cf2.getSpendingRequest(spendingRequest1)
            const spendingRequestValue = getSpendingRequest[3]



            const recipientBalanceBefore = await getBalance(recipient)

            await cf2.transferRequestFunds(spendingRequest1, { from: admin })
            const recipientBalanceAfter = await getBalance(recipient)

            assert.equal(toBN(recipientBalanceBefore).add(toBN(spendingRequestValue)).toString(), recipientBalanceAfter)
        })


    })

    describe("Cannot get refund", () => {

        before(async () => {
            //create new contract
            cf2 = await CF.new(deadline, goal, minCon)


            //contribute to contract
            await Promise.all(voters.map(voter =>
                cf2.contribute({
                    from: voter,
                    value: minCon
                }),

            ))

            //create new spending proposal
            cf2.spendingRequest(title, description, recipient, minCon, { from: admin })

            //vote for that proposal
            await Promise.all(voters.map(voter =>
                cf2.vote(spendingRequest1, {
                    from: voter,
                }),

            ))



        })


        it(" should not get a refund it campaign raised amount has been reached", async () => {
            await time.increase(1001)

            await expectRevert(cf2.getRefund({ from: voter1 }),
                "The campaign raised amount has been reached, cannot refund!"

            )


        })





    })

    describe("Can get a refund", () => {

        before(async () => {
            //create new contract
            cf2 = await CF.new(deadline, goal, minCon)


            //contribute to contract
            await cf2.contribute({ from: voter1, value: minCon })



        })


        it("should get a refund ", async () => {
            await time.increase(1001)

            const balancesBefore = await getBalance(voter1)


            const tx = await cf2.getRefund({ from: voter1 })

            const gasUsed = await getGas(tx)

            const balancesAfter = await getBalance(voter1)


            assert.equal(toBN(balancesBefore).add(toBN(minCon)).sub(gasUsed).toString(), balancesAfter, "After refund the balances do not match!")




        })



    })

    describe("Transfer adminship", () => {

        before(async () => {
            //create new contract
            cf2 = await CF.new(deadline, goal, minCon)



        })

        it("only admin should transfer ownership ", async () => {
            await expectRevert(cf2.transferOwnership(admin2, { from: voter1 }),
                "Only admin!"
            )



        })

        it("should transfer ownership ", async () => {
            await cf2.transferOwnership(admin2, { from: admin })

            const newadmin = await cf2.admin()

            assert.equal(newadmin, admin2, "admin trasnfer not successful!")

        })


    })

})