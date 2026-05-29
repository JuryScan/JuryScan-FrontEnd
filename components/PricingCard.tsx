interface PlanType {
    title: string;
    price: number;
    credits: number;
    type: string;
}

interface PricingCardProps {
    plan: PlanType;
    selected: boolean;
    onSelect: () => void;
}

export default function PricingCard({ plan, selected, onSelect }: PricingCardProps) {
    return (
        <div
            onClick={onSelect}
            style={{
                backgroundColor: "#fff",
                borderRadius: "20px",
                padding: "30px",
                cursor: "pointer",
                border: selected
                    ? "3px solid #633B48"
                    : "2px solid #eee",
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                transition: "0.2s"
            }}
        >
            <h2
                style={{
                    color: "#333",
                    marginBottom: "15px"
                }}
            >
                {plan.title}
            </h2>

            <p
                style={{
                    fontSize: "38px",
                    fontWeight: "bold",
                    color: "#633B48",
                    marginBottom: "15px"
                }}
            >
                ${plan.price}
            </p>

            <p
                style={{
                    color: "#666",
                    marginBottom: "20px"
                }}
            >
                {plan.credits} credits
            </p>

            <span
                style={{
                    backgroundColor: "#f3e7ec",
                    color: "#633B48",
                    padding: "8px 14px",
                    borderRadius: "999px",
                    fontSize: "13px",
                    fontWeight: "bold"
                }}
            >
                {plan.type}
            </span>
        </div>
    );
}