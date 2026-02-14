package com.example.lawntrammer
import android.os.Bundle
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.button.MaterialButton
import com.google.android.material.card.MaterialCardView
import android.view.ViewGroup
import android.view.LayoutInflater
import com.example.lawntrammer.R

class CustomerJobTrackingActivity : AppCompatActivity() {

    private lateinit var jobContainer: LinearLayout
    private lateinit var btnRefresh: MaterialButton
    private lateinit var btnSunToggle: MaterialButton

    private var darkMode = false

    data class Job(
        val title: String,
        var status: String,
        val time: String
    )

    private val jobs = mutableListOf(
        Job("Lawn Mowing - Johnson Residence", "Requested", "Last updated: 2 mins ago"),
        Job("Hedge Trimming - Park Avenue", "Accepted", "Last updated: 10 mins ago"),
        Job("Leaf Blowing - Hill Street", "In Progress", "Last updated: 30 mins ago"),
        Job("Edging - Suburbia Blvd", "Completed", "Last updated: Yesterday")
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_customer_job_tracking)

        jobContainer = findViewById(R.id.jobContainer)
        btnRefresh = findViewById(R.id.btnRefresh)
        btnSunToggle = findViewById(R.id.btnSunToggle)

        btnRefresh.setOnClickListener {
            refreshJobs()
        }

        btnSunToggle.setOnClickListener {
            darkMode = !darkMode
            applyTheme()
        }

        renderJobs()
    }

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

    private fun refreshJobs() {
        val statuses = listOf("Requested", "Accepted", "In Progress", "Completed")
        for (job in jobs) {
            job.status = statuses.random()
        }
        renderJobs()
    }

    private fun applyTheme() {
        val backgroundColor = if (darkMode) R.color.darkBackground else R.color.lightBackground
        val textColor = if (darkMode) R.color.white else R.color.black
        findViewById<LinearLayout>(R.id.headerLayout).setBackgroundResource(backgroundColor)
        findViewById<LinearLayout>(R.id.footerLayout).setBackgroundResource(backgroundColor)
        jobContainer.setBackgroundResource(backgroundColor)
        // Optionally: loop over job cards and set text color dynamically
    }
}
