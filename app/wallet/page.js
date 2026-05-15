import WalletPanel from "../../components/WalletPanel";


const clienteData = {
    name: "Fulano",
    profileImage: null
};

export default function WalletPage() {
    return <WalletPanel cliente={clienteData} />;
}