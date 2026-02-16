package com.example.lawntrammer

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.widget.ImageButton
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.button.MaterialButton

class CustomerJobTrackingActivity : AppCompatActivity() {

    private lateinit var jobContainer: LinearLayout
    private lateinit var btnRefresh: MaterialButton
    private lateinit var btnSunToggle: MaterialButton

    private lateinit var btnProfile: ImageButton
    private lateinit var btnJobTrack: ImageButton
    private lateinit var btnHome: ImageButton
    private lateinit var btnEarnings: ImageButton

    private var darkMode = false

    // Data class
    data class Job(
        val title: String,
        var status: String,
        val time: String
    )

    // Sample Data
    private val jobs = mutableListOf(
        Job("Lawn Mowing - Johnson Residence", "Requested", "Last updated: 2 mins ago"),
        Job("Hedge Trimming - Park Avenue", "Accepted", "Last updated: 10 mins ago"),
        Job("Leaf Blowing - Hill Street", "In Progress", "Last updated: 30 mins ago"),
        Job("Edging - Suburbia Blvd", "Completed", "Last updated: Yesterday")
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_customer_job_tracking)

        // 1️⃣ Initialize all views
        initViews()

        // 2️⃣ Setup listeners
        setupListeners()

        // 3️⃣ Other actions
        btnRefresh.setOnClickListener {
            refreshJobs()
        }

        btnSunToggle.setOnClickListener {
            darkMode = !darkMode
            applyTheme()
        }

        // 4️⃣ Render jobs
        renderJobs()
    }

    // ============================
    // Initialize Views
    // ============================
    private fun initViews() {
        jobContainer = findViewById(R.id.jobContainer)
        btnRefresh = findViewById(R.id.btnRefresh)
        btnSunToggle = findViewById(R.id.btnSunToggle)

        btnProfile = findViewById(R.id.btnProfile)
        btnJobTrack = findViewById(R.id.btnJobs)
        btnHome = findViewById(R.id.btnHome)
        btnEarnings = findViewById(R.id.btnPayments)

        // Disable current screen button (important)
        btnJobTrack.isEnabled = false
    }

    // ============================
    // Setup Navigation
    // ============================
    private fun setupListeners() {

        btnProfile.setOnClickListener {
            startActivity(Intent(this, CustomerProfileActivity::class.java))
        }

        btnHome.setOnClickListener {
            val intent = Intent(this, ServiceBookingActivity::class.java)
            startActivity(intent)
        }

        btnEarnings.setOnClickListener {
            startActivity(Intent(this, CustomerPaymentActivity::class.java))
        }
    }

    // ============================
    // Render Job Cards
    // ============================
    private fun renderJobs() {
        jobContainer.removeAllViews()

        for (job in jobs) {
            val jobView = LayoutInflater.from(this)
                .inflate(R.layout.activity_item_job_card, jobContainer, false)

            val tvTitle = jobView.findViewById<TextView>(R.id.tvJobTitle)
            val tvStatus = jobView.findViewById<TextView>(R.id.tvJobStatus)
            val tvTime = jobView.findViewById<TextView>(R.id.tvJobTime)

            tvTitle.text = job.title
            tvStatus.text = job.status
            tvTime.text = job.time

            jobContainer.addView(jobView)
        }
    }

    // ============================
    // Refresh Random Status
    // ============================
    private fun refreshJobs() {
        val statuses = listOf("Requested", "Accepted", "In Progress", "Completed")
        for (job in jobs) {
            job.status = statuses.random()
        }
        renderJobs()
    }

    // ============================
    // Dark / Light Mode
    // ============================
    private fun applyTheme() {
        val backgroundColor =
            if (darkMode) R.color.darkBackground else R.color.lightBackground

        findViewById<LinearLayout>(R.id.headerLayout)
            .setBackgroundResource(backgroundColor)

        findViewById<LinearLayout>(R.id.footerLayout)
            .setBackgroundResource(backgroundColor)

        jobContainer.setBackgroundResource(backgroundColor)
    }
}
