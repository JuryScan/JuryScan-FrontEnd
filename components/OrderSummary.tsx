interface PlanType {
    title: string;
    credits: number;
    price: number;
}

interface OrderSummaryProps {
    selectedPlan: PlanType | null;
    discount: number;
    finalPrice: number;
}

export default function OrderSummary({ selectedPlan, discount, finalPrice }: OrderSummaryProps) {
    return (
        <div
            style={{
                backgroundColor: "#fff",
                borderRadius: "20px",
                padding: "30px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
            }}
        >
            <h2
                style={{
                    color: "#633B48",
                    marginBottom: "25px"
                }}
            >
                Order Summary
            </h2>

            {!selectedPlan ? (
                <p style={{ color: "#777" }}>
                    Select a plan to continue.
                </p>
            ) : (
                <>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "15px"
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between"
                            }}
                        >
                            <span>Selected Plan</span>
                            <strong>{selectedPlan.title}</strong>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between"
                            }}
                        >
                            <span>Credits</span>
                            <strong>{selectedPlan.credits}</strong>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between"
                            }}
                        >
                            <span>Discount</span>
                            <strong>{discount}%</strong>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between"
                            }}
                        >
                            <span>Original Price</span>
                            <strong>${selectedPlan.price}</strong>
                        </div>

                        <hr />

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "22px",
                                color: "#633B48",
                                fontWeight: "bold"
                            }}
                        >
                            <span>Total</span>
                            <span>${finalPrice}</span>
                        </div>
                    </div>

                    <button
                        style={{
                            marginTop: "30px",
                            width: "100%",
                            padding: "18px",
                            borderRadius: "14px",
                            border: "none",
                            backgroundColor: "#633B48",
                            color: "#fff",
                            fontSize: "17px",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        Proceed to Payment
                    </button>
                </>
            )}
        </div>
    );
}