package com.example.lawntrammer

import android.os.Bundle
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.button.MaterialButton
import android.view.LayoutInflater
import android.view.View

class ProviderDashboardActivity : AppCompatActivity() {

    private lateinit var activeJobsContainer: LinearLayout
    private lateinit var jobRequestsContainer: LinearLayout
    private lateinit var scheduledJobsContainer: LinearLayout
    private lateinit var btnToggleTheme: MaterialButton

    private var darkMode = false

    data class Job(
        val title: String,
        val location: String,
        val time: String
    )

    private val activeJobs = listOf(
        Job("Front Lawn - Weekly", "123 Main St, Suburbia", "Today at 2:00 PM")
    )

    private val jobRequests = listOf(
        Job("Front Lawn - Weekly", "123 Main St, Suburbia", "Today at 2:00 PM"),
        Job("Lawn - Weekly", "256 Main St, Suburbia", "Tomorrow at 2:30 PM")
    )

    private val scheduledJobs = listOf(
        Job("Front Lawn - Daily", "256 Main St, Suburbia", "Today at 2:00 PM"),
        Job("Front Lawn - Weekly", "256 Main St, Suburbia", "Today at 2:30 PM")
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_provider_dashboard)

        activeJobsContainer = findViewById(R.id.activeJobsContainer)
        jobRequestsContainer = findViewById(R.id.jobRequestsContainer)
        scheduledJobsContainer = findViewById(R.id.scheduledJobsContainer)
        btnToggleTheme = findViewById(R.id.btnToggleTheme)

        btnToggleTheme.setOnClickListener {
            darkMode = !darkMode
            applyTheme()
        }

        renderJobs()
    }

    private fun renderJobs() {
        // Active Jobs
        activeJobsContainer.removeAllViews()
        for (job in activeJobs) {
            val jobView = LayoutInflater.from(this)
                .inflate(R.layout.activity_item_job_card, activeJobsContainer, false)
            setJobData(jobView, job)
            activeJobsContainer.addView(jobView)
        }

        // Job Requests
        jobRequestsContainer.removeAllViews()
        for (job in jobRequests) {
            val jobView = LayoutInflater.from(this)
                .inflate(R.layout.activity_item_job_card, jobRequestsContainer, false)
            setJobData(jobView, job)
            jobRequestsContainer.addView(jobView)
        }

        // Scheduled Jobs
        scheduledJobsContainer.removeAllViews()
        for (job in scheduledJobs) {
            val jobView = LayoutInflater.from(this)
                .inflate(R.layout.activity_item_job_card, scheduledJobsContainer, false)
            setJobData(jobView, job)
            scheduledJobsContainer.addView(jobView)
        }
    }

    private fun setJobData(view: View, job: Job) {
        view.findViewById<TextView>(R.id.tvJobTitle).text = job.title
        val tvStatus = view.findViewById<TextView>(R.id.tvJobStatus)
        tvStatus.text = if (darkMode) "Pending" else "Requested" // Example status
        view.findViewById<TextView>(R.id.tvJobTime).text = job.time
        // If you want to show location in card, make sure to add tvJobLocation in item_job_card.xml
    }

    private fun applyTheme() {
        val bgColor = if (darkMode) R.color.darkBackground else R.color.lightBackground
        val textColor = if (darkMode) R.color.white else R.color.black

        findViewById<LinearLayout>(R.id.headerLayout).setBackgroundResource(bgColor)
        findViewById<LinearLayout>(R.id.footerLayout).setBackgroundResource(bgColor)
        findViewById<LinearLayout>(R.id.activeJobsContainer).setBackgroundResource(bgColor)
        findViewById<LinearLayout>(R.id.jobRequestsContainer).setBackgroundResource(bgColor)
        findViewById<LinearLayout>(R.id.scheduledJobsContainer).setBackgroundResource(bgColor)

        // Optionally update all job card text colors dynamically
        fun updateTextColor(container: LinearLayout) {
            for (i in 0 until container.childCount) {
                val card = container.getChildAt(i)
                card.findViewById<TextView>(R.id.tvJobTitle).setTextColor(resources.getColor(textColor))
                card.findViewById<TextView>(R.id.tvJobStatus).setTextColor(resources.getColor(textColor))
                card.findViewById<TextView>(R.id.tvJobTime).setTextColor(resources.getColor(textColor))
            }
        }

        updateTextColor(activeJobsContainer)
        updateTextColor(jobRequestsContainer)
        updateTextColor(scheduledJobsContainer)
    }
}
