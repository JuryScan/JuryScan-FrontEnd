
"use client";

import { useState } from "react";

export default function CouponInput({ setDiscount }) {

    const [coupon, setCoupon] = useState("");

    const handleCoupon = () => {

        if (coupon === "JURY10") {
            setDiscount(10);
            alert("Coupon applied successfully!");
        } else {
            setDiscount(0);
            alert("Invalid coupon.");
        }
    };

    return (
        <div
            style={{
                backgroundColor: "#fff",
                padding: "25px",
                borderRadius: "20px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
            }}
        >

            <h3
                style={{
                    marginBottom: "20px",
                    color: "#633B48"
                }}
            >
                Discount Coupon
            </h3>

            <div
                style={{
                    display: "flex",
                    gap: "15px"
                }}
            >

                <input
                    type="text"
                    placeholder="Enter coupon"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    style={{
                        flex: 1,
                        padding: "14px",
                        borderRadius: "12px",
                        border: "1px solid #ccc",
                        fontSize: "15px"
                    }}
                />

                <button
                    onClick={handleCoupon}
                    style={{
                        padding: "14px 24px",
                        borderRadius: "12px",
                        border: "none",
                        backgroundColor: "#633B48",
                        color: "#fff",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    Apply
                </button>

            </div>
        </div>
    );
}