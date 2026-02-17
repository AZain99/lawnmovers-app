package com.example.lawntrammer

import android.content.Intent
import android.graphics.Typeface
import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView

class EarningsActivity : AppCompatActivity() {

    private lateinit var jobHistoryContainer: LinearLayout
    private lateinit var btnRequestPayout: Button

    private lateinit var btnHome: ImageView

    private lateinit var btnJobs: ImageView
    private lateinit var btnPayments: ImageView

    private lateinit var btnProfile: ImageView



    // Local data class for this screen only
    data class JobItem(
        val title: String,
        val address: String,
        val amount: String,
        val dateTime: String,
        val isPositive: Boolean
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_earnings)

        initViews()
        setupListeners()


        jobHistoryContainer = findViewById(R.id.jobHistoryContainer)
        btnRequestPayout = findViewById(R.id.btnRequestPayout)

        // Handle payout button click
        btnRequestPayout.setOnClickListener {
            Toast.makeText(this, "Payout Requested!", Toast.LENGTH_SHORT).show()
        }

        // Sample jobs for this screen
        val jobs = listOf(
            JobItem("Lawn Moving (Large)", "456 Oak Ave, Suburbia", "+$65.50", "Today, 10:30 AM", true),
            JobItem("Hedge Trimming", "786 Pine St, Suburbia", "+$40.00", "Today, 01:00 PM", true),
            JobItem("Customer Refund", "321 Maple Rd, Suburbia", "-$15.50", "Yesterday, 03:45 PM", false)
        )

        // Add job cards dynamically
        for (job in jobs) {
            addJobCard(job)
        }
    }

    private fun initViews() {


        btnJobs = findViewById(R.id.btnJobs)
        btnPayments =  findViewById(R.id.btnPayments)

        btnHome=  findViewById(R.id.btnHome)
        btnProfile=  findViewById(R.id.btnProfile)


    }



    private fun addJobCard(job: JobItem) {
        // Create CardView
        val card = CardView(this)
        card.layoutParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        ).apply { topMargin = 16 }
        card.radius = 12f
        card.cardElevation = 4f

        // Inner LinearLayout
        val layout = LinearLayout(this)
        layout.orientation = LinearLayout.VERTICAL
        layout.setPadding(24, 24, 24, 24)

        // Job Title
        val tvTitle = TextView(this)
        tvTitle.text = job.title
        tvTitle.textSize = 16f
        tvTitle.setTypeface(null, Typeface.BOLD)

        // Job Address
        val tvAddress = TextView(this)
        tvAddress.text = job.address
        tvAddress.textSize = 12f
        tvAddress.setTextColor(resources.getColor(R.color.gray))

        // Job Amount
        val tvAmount = TextView(this)
        tvAmount.text = job.amount
        tvAmount.textSize = 14f
        tvAmount.setTextColor(
            if (job.isPositive) resources.getColor(R.color.green)
            else resources.getColor(R.color.red)
        )

        // Job Date/Time
        val tvDateTime = TextView(this)
        tvDateTime.text = job.dateTime
        tvDateTime.textSize = 12f
        tvDateTime.setTextColor(resources.getColor(R.color.gray))

        // Add views to layout
        layout.addView(tvTitle)
        layout.addView(tvAddress)
        layout.addView(tvAmount)
        layout.addView(tvDateTime)

        // Add layout to CardView
        card.addView(layout)

        // Add CardView to container
        jobHistoryContainer.addView(card)
    }
    private fun setupListeners() {

        btnJobs.setOnClickListener {
            val intent = Intent(this, JobHistoryProviderActivity::class.java)
            startActivity(intent)
        }

        btnHome.setOnClickListener {
            val intent = Intent(this, ProviderDashboardActivity::class.java)
            startActivity(intent)
        }

        btnProfile.setOnClickListener {
            val intent = Intent(this, ProviderProfileActivity::class.java)
            startActivity(intent)
        }



    }

}
