package com.example.lawntrammer

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class CustomerProfileActivity : AppCompatActivity() {

    private lateinit var btnTheme: ImageView
    private lateinit var btnSave: Button
    private var darkMode = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_customer_profile)

        // Views
        btnTheme = findViewById(R.id.btnThemeCustomer)
        btnSave = findViewById(R.id.btnSave)

        // Theme toggle
        btnTheme.setOnClickListener {
            darkMode = !darkMode
            recreate()
        }

        // Footer Buttons
        val btnHome = findViewById<ImageButton>(R.id.btnHome)
        val btnEarnings = findViewById<ImageButton>(R.id.btnPayments)
        val btnJobs = findViewById<ImageButton>(R.id.btnJobs)
        val btnProfile = findViewById<ImageButton>(R.id.btnProfile)



        btnHome.setOnClickListener {
            val intent = Intent(this, ServiceBookingActivity::class.java)
            startActivity(intent)
        }
        btnJobs.setOnClickListener {
            val intent = Intent(this, CustomerJobTrackingActivity::class.java)
            startActivity(intent)
        }
        btnEarnings.setOnClickListener {
            startActivity(Intent(this, CustomerPaymentActivity::class.java))

        }
    }
}
