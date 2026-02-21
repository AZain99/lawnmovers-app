package com.example.lawntrammer

import android.content.Intent
import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.Typeface
import android.os.Bundle
import android.view.Gravity
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView
import com.google.android.material.button.MaterialButton

class CustomerPaymentActivity : AppCompatActivity() {

    private lateinit var layoutPaymentList: LinearLayout
    private var isDarkMode = false

    data class PaymentRecord(
        val service: String,
        val date: String,
        val amount: Double,
        val status: String
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_customer_payment)

        layoutPaymentList = findViewById(R.id.layoutPaymentList)

        setupNavigation()
        renderPayments()
        btnHome()
        btnProfile()
    }

    private fun renderPayments() {
        layoutPaymentList.removeAllViews()

        val payments = listOf(
            PaymentRecord("Lawn Mowing - Johnson", "Feb 14, 2026", 55.00, "Unpaid"),
            PaymentRecord("Hedge Trimming - Park Ave", "Feb 12, 2026", 42.50, "Paid"),
            PaymentRecord("Leaf Blowing - Hill St", "Feb 10, 2026", 30.00, "Paid"),
            PaymentRecord("Edging - Suburbia Blvd", "Jan 28, 2026", 25.00, "Paid")
        )

        for (item in payments) {
            val card = createPaymentCard(item)
            layoutPaymentList.addView(card)
        }
    }

    private fun createPaymentCard(item: PaymentRecord): CardView {

        val card = CardView(this).apply {
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply { setMargins(16, 16, 16, 16) }

            radius = 32f
            setCardBackgroundColor(
                if (isDarkMode) Color.parseColor("#1B2133") else Color.WHITE
            )
            setContentPadding(40, 40, 40, 40)
        }

        val row = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
        }

        // LEFT SIDE
        val info = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = LinearLayout.LayoutParams(
                0,
                LinearLayout.LayoutParams.WRAP_CONTENT,
                1f
            )
        }

        info.addView(TextView(this).apply {
            text = item.service
            setTextColor(if (isDarkMode) Color.WHITE else Color.BLACK)
            setTypeface(null, Typeface.BOLD)
            textSize = 16f
        })

        info.addView(TextView(this).apply {
            text = item.date
            setTextColor(Color.GRAY)
            textSize = 12f
        })

        // RIGHT SIDE
        val actionSide = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.END
        }

        actionSide.addView(TextView(this).apply {
            text = "$${String.format("%.2f", item.amount)}"
            setTextColor(if (isDarkMode) Color.WHITE else Color.BLACK)
            setTypeface(null, Typeface.BOLD)
            textSize = 16f
        })

        if (item.status == "Paid") {

            actionSide.addView(TextView(this).apply {
                text = "Paid"
                setTextColor(Color.parseColor("#10B981"))
                setTypeface(null, Typeface.BOLD)
                textSize = 12f
            })

        } else {

            actionSide.addView(TextView(this).apply {
                text = "Unpaid"
                setTextColor(Color.parseColor("#EF4444"))
                textSize = 10f
                setPadding(0, 0, 0, 8)
            })

            // ✅ FIXED BUTTON (No R error)
            val payButton = MaterialButton(this).apply {
                text = "Pay Now"
                cornerRadius = 40
                textSize = 12f
                backgroundTintList =
                    ColorStateList.valueOf(Color.parseColor("#10B981"))

                setOnClickListener {
                    Toast.makeText(
                        context,
                        "Redirecting to Payment Gateway...",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            actionSide.addView(payButton)
        }

        row.addView(info)
        row.addView(actionSide)
        card.addView(row)

        return card
    }

    private fun setupNavigation() {
        findViewById<ImageButton>(R.id.btnJobs).setOnClickListener {
            startActivity(Intent(this, CustomerJobTrackingActivity::class.java))
        }
    }


    private fun btnHome() {
        findViewById<ImageButton>(R.id.btnHome).setOnClickListener {
            startActivity(Intent(this, ServiceBookingActivity::class.java))
        }
    }
    private fun btnProfile() {
        findViewById<ImageButton>(R.id.btnProfile).setOnClickListener {
            startActivity(Intent(this, CustomerProfileActivity::class.java))
        }
    }
}
