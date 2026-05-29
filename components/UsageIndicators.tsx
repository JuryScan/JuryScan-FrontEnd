interface UsageIndicatorsProps {
    used: number;
    remaining: number | string;
}

export default function UsageIndicators({ used, remaining }: UsageIndicatorsProps) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '20px',
            marginBottom: '20px'
        }}>
            <div style={{
                flex: 1,
                padding: '15px',
                borderRadius: '12px',
                backgroundColor: '#fff0f6',
                textAlign: 'center'
            }}>
                <h3 style={{ marginBottom: '5px' }}>Used This Month</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{used} credits</p>
            </div>
            <div style={{
                flex: 1,
                padding: '15px',
                borderRadius: '12px',
                backgroundColor: '#fff0f6',
                textAlign: 'center'
            }}>
                <h3 style={{ marginBottom: '5px' }}>Remaining in Plan</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{remaining} credits</p>
            </div>
        </div>
    );
}