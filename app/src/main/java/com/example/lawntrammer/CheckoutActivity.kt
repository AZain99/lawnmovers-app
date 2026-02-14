package com.example.lawntrammer

import android.content.res.ColorStateList
import android.graphics.Color
import android.os.Bundle
import android.view.Gravity
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.button.MaterialButton
import com.google.android.material.card.MaterialCardView

class CheckoutActivity : AppCompatActivity() {

    private lateinit var layoutMethods: LinearLayout
    private lateinit var btnConfirmPay: MaterialButton
    private var selectedMethodId: Int = -1
    private var isDarkMode = true

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_checkout)

        layoutMethods = findViewById(R.id.layoutPaymentMethods)
        btnConfirmPay = findViewById(R.id.btnConfirmPay)

        btnConfirmPay.isEnabled = false
        btnConfirmPay.alpha = 0.5f

        renderPaymentMethods()

        findViewById<ImageButton>(R.id.btnBack).setOnClickListener {
            finish()
        }
    }

    private fun renderPaymentMethods() {
        layoutMethods.removeAllViews()

        val methods = listOf(
            PaymentMethod(1, "Visa ending in 4242", "Expires 12/26", R.drawable.ic_visa),
            PaymentMethod(2, "Mastercard ending in 8891", "Expires 05/27", R.drawable.ic_mastercard),
            PaymentMethod(3, "Google Pay", "Fast checkout", R.drawable.ic_google_pay),
            PaymentMethod(4, "Add New Method", "", R.drawable.ic_add_circle)
        )

        for (method in methods) {
            val card = createMethodCard(method)
            layoutMethods.addView(card)
        }
    }

    private fun createMethodCard(method: PaymentMethod): MaterialCardView {

        val card = MaterialCardView(this).apply {
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                setMargins(0, 0, 0, 24)
            }

            radius = 24f
            setCardBackgroundColor(
                if (isDarkMode) Color.parseColor("#1B2133")
                else Color.WHITE
            )

            strokeWidth = if (selectedMethodId == method.id) 4 else 0
            strokeColor = Color.parseColor("#10B981")

            setOnClickListener {
                selectedMethodId = method.id
                renderPaymentMethods()
                btnConfirmPay.isEnabled = true
                btnConfirmPay.alpha = 1.0f
            }
        }

        val row = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            setPadding(40, 40, 40, 40)
            gravity = Gravity.CENTER_VERTICAL
        }

        val icon = ImageView(this).apply {
            setImageResource(method.iconRes)
            layoutParams = LinearLayout.LayoutParams(80, 80)
        }

        val details = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = LinearLayout.LayoutParams(
                0,
                LinearLayout.LayoutParams.WRAP_CONTENT,
                1f
            ).apply {
                setMargins(32, 0, 0, 0)
            }
        }

        details.addView(TextView(this).apply {
            text = method.title
            setTextColor(if (isDarkMode) Color.WHITE else Color.BLACK)
            textSize = 15f
        })

        if (method.subtitle.isNotEmpty()) {
            details.addView(TextView(this).apply {
                text = method.subtitle
                setTextColor(Color.GRAY)
                textSize = 12f
            })
        }

        val radioButton = RadioButton(this).apply {
            isChecked = selectedMethodId == method.id
            isClickable = false
            buttonTintList =
                ColorStateList.valueOf(Color.parseColor("#10B981"))
        }

        row.addView(icon)
        row.addView(details)
        row.addView(radioButton)

        card.addView(row)

        return card
    }

    data class PaymentMethod(
        val id: Int,
        val title: String,
        val subtitle: String,
        val iconRes: Int
    )
}
