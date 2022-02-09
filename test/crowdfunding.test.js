//const web3 = require('web3');
const { assert } = require("chai");
const { expectRevert, time } = require('@openzeppelin/test-helpers');
const { web3 } = require("@openzeppelin/test-helpers/src/setup");



const CF = artifacts.require('CrowdFunding')


contract("voting DApp", accounts => {
    const [admin, voter1, voter2, voter3, recipient] = [accounts[0], accounts[1], accounts[2], accounts[3], accounts[4]];
    const [spendingRequest1, spendingRequest2] = [0, 1]

    //-----------------------helper functions----------------------------
    const toBN = value => web3.utils.toBN(value)
    const getBalance = async address => web3.eth.getBalance(address)
    const fromWei = value => web3.utils.fromWei(value, "ether")


    const getGas = async result => {

        const txHash = await web3.eth.getTransaction(result.tx)
        const gasUsed = toBN(result.receipt.gasUsed)
        const gasPrice = toBN(txHash.gasPrice)

        const gas = gasUsed.mul(gasPrice)

        return gas
    }
    //-----------------------/helper functions----------------------------


    //-----------------------constructor parameters-----------------------
    const deadline = 1000;              // 1000 sec.
    const goal = "300000000000000000"   // 0,3 ETH
    const minCon = "100000000000000000" // 0,1 ETH
    //-----------------------/constructor parameters-----------------------


    //spending request
    const title = "new office"
    const description = "new office"

    let cf = null
    let cf2 = null
    let raisedAmount = ""
    let minContribution = ""

    before(async () => {
        cf = await CF.deployed()
        minContribution = await cf.minContribution()

    })



    describe("contribute", () => {



        it("can contribute if < minimum contribution", async () => {

            // const minContribution = await cf.minContribution()

            const underMinCon = toBN(minContribution).sub(toBN("10000"))
            await expectRevert(cf.contribute({ from: voter1, value: underMinCon }),
                "Minimum contribution not met!"

            )

        })

        it("can contribute", async () => {
            const minContribution = await cf.minContribution()

            let balanceBefore1 = await getBalance(voter1);
            let balanceBefore2 = await getBalance(voter2);
            let balanceBefore3 = await getBalance(voter3);

            const tx1 = await cf.contribute({ from: voter1, value: minContribution })
            const tx2 = await cf.contribute({ from: voter2, value: minContribution })
            const tx3 = await cf.contribute({ from: voter3, value: minContribution })

            const gasUsedtx1 = await getGas(tx1)
            const gasUsedtx2 = await getGas(tx2)
            const gasUsedtx3 = await getGas(tx3)

            let balanceAfter1 = await getBalance(voter1);
            let balanceAfter2 = await getBalance(voter2);
            let balanceAfter3 = await getBalance(voter3);

            const conValue1 = await cf.contributors(voter1);
            const conValue2 = await cf.contributors(voter2);
            const conValue3 = await cf.contributors(voter3);


            assert.equal(toBN(balanceBefore1).sub(toBN(minContribution)).sub(gasUsedtx1).toString(), balanceAfter1)
            assert.equal(toBN(balanceBefore2).sub(toBN(minContribution)).sub(gasUsedtx2).toString(), balanceAfter2)
            assert.equal(toBN(balanceBefore3).sub(toBN(minContribution)).sub(gasUsedtx3).toString(), balanceAfter3)

            //contributors value from mapping
            assert.equal(conValue1.toString(), minContribution)
            assert.equal(conValue2.toString(), minContribution)
            assert.equal(conValue3.toString(), minContribution)

        })




    })
    describe("create spending request", () => {



        it("only admin can create new spending request", async () => {
            await expectRevert(
                cf.spendingRequest(title, description, recipient, minContribution, { from: voter1 }),
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
            await cf.spendingRequest(title, description, recipient, minContribution, { from: admin })

            const getSpendingRequest = await cf.getSpendingRequest(0)


            assert.equal(getSpendingRequest[1], description, "Spending request descriptions do NOT match");
            assert.equal(getSpendingRequest[2], title, "Spending request titles do NOT match");
            assert.equal(getSpendingRequest[3].toString(), minContribution, "Spending request minimum contributions do NOT match");
            assert.equal(getSpendingRequest[4].toString(), recipient, "Spending request recipient addresses do NOT match");
            assert.equal(getSpendingRequest[5].toString(), 0, "Spending request votes should be 0 ");
            assert.equal(getSpendingRequest[6], false, "Spending request should not be completed yet");
        })


    })

    describe("spending request voting", () => {
        it("only contributors can vote for spending request", async () => {
            await expectRevert(
                cf.vote(spendingRequest1, { from: recipient }),
                "No right to vote!"

            )

        })

        it("can vote", async () => {
            await cf.vote(spendingRequest1, { from: voter1 });
            await cf.vote(spendingRequest1, { from: voter2 });
            await cf.vote(spendingRequest1, { from: voter3 });

            const vote1 = await cf.votedForSpendingRequest(spendingRequest1, { from: voter1 })
            const vote2 = await cf.votedForSpendingRequest(spendingRequest1, { from: voter2 })
            const vote3 = await cf.votedForSpendingRequest(spendingRequest1, { from: voter3 })

            assert.equal(vote1, true, "voter1 should have voted for spendingRequest1");
            assert.equal(vote2, true, "voter2 should have voted for spendingRequest2");
            assert.equal(vote3, true, "voter3 should have voted for spendingRequest3");

        })

        it("can only vote once", async () => {
            await expectRevert(cf.vote(0, { from: voter1 }),
                "You have allready voted for this spending request!"


            )

        })


    })

    describe("transfer funds", () => {

        before(async () => {
            cf2 = await CF.deployed()
            cf2.spendingRequest(title, description, recipient, minContribution, { from: admin })


            const tx1 = await cf2.contribute({ from: voter1, value: minContribution })
            const tx2 = await cf2.contribute({ from: voter2, value: minContribution })
            const tx3 = await cf2.contribute({ from: voter3, value: minContribution })

            const vote1 = await cf2.votedForSpendingRequest(spendingRequest2, { from: voter1 })

        })
        it("only admin can transfer request funds", async () => {

            await expectRevert(
                cf2.transferRequestFunds(spendingRequest2, { from: voter1 }),
                "Only admin!"

            )

        })

        it("can transfer funds only if spending request has > 1/2 votes from contributors", async () => {
            cf2.spendingRequest(title, description, recipient, minContribution, { from: admin })

            await expectRevert(
                cf2.transferRequestFunds(spendingRequest2, { from: admin }),
                "The request has not received more than half of votes!"

            )

        })
        it("cannot contribute if contribution deadline has expired", async () => {
            await time.increase(1001);
            const minContribution = await cf2.minContribution()


            await expectRevert(cf2.contribute({ from: voter1, value: minContribution }),
                "The campaign contribution deadline ended!"

            )

        })

        it(" can transfer request funds", async () => {
            const getSpendingRequest = await cf.getSpendingRequest(spendingRequest1)
            const spendingRequestValue = getSpendingRequest[3]


            let recipientBalanceBefore = await getBalance(recipient)


            const result = await cf.transferRequestFunds(spendingRequest1, { from: admin })
            const gas = await getGas(result)
          


            let recipientBalanceAfter = await getBalance(recipient)


            assert.equal(toBN(recipientBalanceBefore).add(toBN(spendingRequestValue)).toString(), recipientBalanceAfter)
        })


    })






})