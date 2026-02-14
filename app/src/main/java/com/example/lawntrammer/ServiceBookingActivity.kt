package com.example.lawntrammer

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.view.Gravity
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.lawntrammer.CustomerJobTrackingActivity
import com.google.android.material.button.MaterialButton

class ServiceBookingActivity : AppCompatActivity() {

    private lateinit var gridServices: GridLayout
    private lateinit var tvPropertySize: TextView
    private lateinit var btnDecrease: Button
    private lateinit var btnIncrease: Button

    private lateinit var  btnBookNow : Button
    private lateinit var btnThemeToggle: ImageButton
    private lateinit var layoutSummary: LinearLayout
    private lateinit var btnProfile: ImageButton

    private lateinit var btnJobTrack: ImageButton

    private var darkMode = true
    private var selectedService = "Lawn Mowing"
    private var propertySize = 100

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_service_booking) // Must be first

        initViews()
        setupServices()
        setupPropertySizeControls()
        setupThemeToggle()
        updateSummary()
        setupListeners()
    }

    private fun initViews() {
        gridServices = findViewById(R.id.gridServices)
        tvPropertySize = findViewById(R.id.tvPropertySize)
        btnDecrease = findViewById(R.id.btnDecrease)
        btnIncrease = findViewById(R.id.btnIncrease)
        btnThemeToggle = findViewById(R.id.btnThemeToggle)
        layoutSummary = findViewById(R.id.layoutSummary)
        btnProfile = findViewById(R.id.btnProfile) // Footer profile button
        btnJobTrack = findViewById(R.id.btnJobs)
        btnBookNow = findViewById(R.id.btnBookNow)
    }

    private fun setupServices() {
        val services = listOf("Lawn Mowing", "Trimming", "Landscaping", "Gardening")

        for (service in services) {
            val btn = MaterialButton(this)
            btn.text = service
            btn.setPadding(16, 16, 16, 16)
            btn.cornerRadius = 50
            btn.setBackgroundColor(Color.parseColor("#1B2133"))
            btn.setTextColor(Color.WHITE)
            btn.setOnClickListener {
                selectedService = service
                updateServiceButtons()
            }

            val params = GridLayout.LayoutParams()
            params.width = 0
            params.height = GridLayout.LayoutParams.WRAP_CONTENT
            params.columnSpec = GridLayout.spec(GridLayout.UNDEFINED, 1f)
            params.setMargins(8, 8, 8, 8)
            btn.layoutParams = params

            gridServices.addView(btn)
        }

        updateServiceButtons()
    }

    private fun updateServiceButtons() {
        for (i in 0 until gridServices.childCount) {
            val btn = gridServices.getChildAt(i) as MaterialButton
            if (btn.text == selectedService) {
                btn.setBackgroundColor(Color.parseColor("#10B981"))
                btn.setTextColor(Color.WHITE)
            } else {
                btn.setBackgroundColor(Color.parseColor("#1B2133"))
                btn.setTextColor(Color.WHITE)
            }
        }
    }

    private fun setupPropertySizeControls() {
        tvPropertySize.text = "$propertySize sq yd"

        btnDecrease.setOnClickListener {
            propertySize = (propertySize - 10).coerceAtLeast(0)
            tvPropertySize.text = "$propertySize sq yd"
        }

        btnIncrease.setOnClickListener {
            propertySize += 10
            tvPropertySize.text = "$propertySize sq yd"
        }
    }

    private fun setupThemeToggle() {
        btnThemeToggle.setOnClickListener {
            darkMode = !darkMode
            recreate() // Simple way to toggle theme
        }
    }

    private fun updateSummary() {
        layoutSummary.removeAllViews()

        val serviceCost = 45.0
        val travel = 8.0
        val tax = 4.24
        val total = serviceCost + travel + tax

        val items = listOf(
            "Service Cost" to serviceCost,
            "Travel" to travel,
            "Tax" to tax,
            "Total" to total
        )

        for ((label, value) in items) {
            val row = LinearLayout(this)
            row.orientation = LinearLayout.HORIZONTAL
            row.layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
            row.gravity = Gravity.CENTER_VERTICAL
            row.setPadding(0, 8, 0, 8)

            val tvLabel = TextView(this)
            tvLabel.text = label
            tvLabel.layoutParams =
                LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f)
            tvLabel.setTextColor(Color.BLACK)

            val tvValue = TextView(this)
            tvValue.text = "$$value"
            tvValue.layoutParams =
                LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT)
            tvValue.setTextColor(Color.BLACK)

            row.addView(tvLabel)
            row.addView(tvValue)
            layoutSummary.addView(row)
        }
    }

    private fun setupListeners() {
        btnProfile.setOnClickListener {
            val intent = Intent(this, CustomerProfileActivity::class.java)
            startActivity(intent)
        }
        btnJobTrack.setOnClickListener {
            val intent = Intent(this, CustomerJobTrackingActivity::class.java)
            startActivity(intent)
        }
        btnBookNow.setOnClickListener {
            val intent = Intent(this, CustomerPaymentActivity::class.java)
            startActivity(intent)
        }
    }
}
