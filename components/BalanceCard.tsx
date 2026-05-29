interface BalanceCardProps {
    credits: number;
    value: number;
}

export default function BalanceCard({ credits, value }: BalanceCardProps) {
    return (
        <div style={{
            padding: '20px',
            borderRadius: '12px',
            backgroundColor: '#ffe6f0',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center',
            marginBottom: '20px'
        }}>
            <h2 style={{ marginBottom: '10px' }}>Current Balance</h2>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '5px 0' }}>
                {credits} credits
            </p>
            <p style={{ fontSize: '18px', color: '#666' }}>≈ ${value}</p>
        </div>
    );
}