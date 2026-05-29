"use client";

import { useState } from "react";
import PricingCard from "./PricingCard";
import CouponInput from "./CouponInput";
import OrderSummary from "./OrderSummary";

interface PlanType {
    id: number;
    title: string;
    price: number;
    credits: number | string;
    type: string;
}

interface PricingCardProps {
    plan: {
        id: number;
        title: string;
        price: number;
        credits: number | string;
        type: string;
    };
    selected: boolean;
    onSelect: () => void;
}

export default function PurchasePanel() {
    const plans: PlanType[] = [
        {
            id: 1,
            title: "Single Analysis",
            price: 20,
            credits: 1,
            type: "One-Time"
        },
        {
            id: 2,
            title: "50 Analysis Package",
            price: 400,
            credits: 50,
            type: "Package"
        },
        {
            id: 3,
            title: "Premium Unlimited",
            price: 1200,
            credits: "Unlimited",
            type: "Subscription"
        }
    ];


    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [discount, setDiscount] = useState<number>(0);

    const finalPrice = selectedPlan
        ? selectedPlan.price - (selectedPlan.price * discount) / 100
        : 0;

    return (
        <div
            style={{
                maxWidth: "1100px",
                margin: "50px auto",
                padding: "30px",
                display: "flex",
                flexDirection: "column",
                gap: "40px"
            }}
        >
            <div>
                <h1
                    style={{
                        fontSize: "34px",
                        color: "#633B48",
                        marginBottom: "10px"
                    }}
                >
                    Purchase Credits
                </h1>

                <p style={{ color: "#777" }}>
                    Select the ideal plan for your needs.
                </p>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "25px"
                }}
            >
                {plans.map((plan) => (
                    <PricingCard
                        key={plan.id}
                        plan={plan as any}
                        selected={selectedPlan?.id === plan.id}
                        onSelect={() => setSelectedPlan(plan)}
                    />
                ))}
            </div>

            <CouponInput setDiscount={setDiscount} />

            <OrderSummary
                selectedPlan={selectedPlan}
                discount={discount}
                finalPrice={finalPrice}
            />
        </div>
    );
}