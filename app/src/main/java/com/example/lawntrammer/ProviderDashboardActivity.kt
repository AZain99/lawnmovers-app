package com.example.lawntrammer

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.button.MaterialButton

class ProviderDashboardActivity : AppCompatActivity() {

    private lateinit var activeJobsContainer: LinearLayout
    private lateinit var jobRequestsContainer: LinearLayout
    private lateinit var scheduledJobsContainer: LinearLayout
    private lateinit var btnToggleTheme: MaterialButton

    private lateinit var btnHome: LinearLayout
    private lateinit var btnPayments: LinearLayout
    private lateinit var btnJobs: LinearLayout
    private lateinit var btnProfile: LinearLayout

    private var darkMode = false

    // Job data class
    data class Job(
        val title: String,
        val location: String,
        val time: String
    )

    // Sample job lists
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

        initViews()
        setupListeners()

        // Initialize containers and theme toggle
        activeJobsContainer = findViewById(R.id.activeJobsContainer)
        jobRequestsContainer = findViewById(R.id.jobRequestsContainer)
        scheduledJobsContainer = findViewById(R.id.scheduledJobsContainer)
        btnToggleTheme = findViewById(R.id.btnToggleTheme)

        btnToggleTheme.setOnClickListener {
            darkMode = !darkMode
            applyTheme()
            renderJobs() // update card status text colors
        }

        renderJobs()
    }

    private fun initViews() {


        btnHome = findViewById(R.id.navHome)
        btnJobs = findViewById(R.id.navJobs)
        btnPayments =  findViewById(R.id.navPayments)
        btnProfile =  findViewById(R.id.navProfile)



    }
    private fun setupListeners() {
        btnHome.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
        }
        btnJobs.setOnClickListener {
            val intent = Intent(this, JobHistoryProviderActivity::class.java)
            startActivity(intent)
        }
//
        btnPayments.setOnClickListener {
            val intent = Intent(this, EarningsActivity::class.java)
            startActivity(intent)
        }

        btnProfile.setOnClickListener {
            val intent = Intent(this, ProviderProfileActivity::class.java)
            startActivity(intent)
        }


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
        view.findViewById<TextView>(R.id.tvJobLocation)?.text = job.location
        view.findViewById<TextView>(R.id.tvJobTime).text = job.time

        val tvStatus = view.findViewById<TextView>(R.id.tvJobStatus)
        tvStatus.text = if (darkMode) "Pending" else "Requested"

        // Set Navigate button click for this card
        val btnNavigate = view.findViewById<MaterialButton>(R.id.btnNavigate)
        btnNavigate.setOnClickListener {
            val intent = Intent(this, NavigateJobActivity::class.java)
            intent.putExtra("jobTitle", job.title)
            intent.putExtra("jobLocation", job.location)
            intent.putExtra("jobTime", job.time)
            startActivity(intent)
        }
    }

    private fun applyTheme() {
        val bgColor = if (darkMode) R.color.darkBackground else R.color.lightBackground
        val textColor = if (darkMode) R.color.white else R.color.black

        findViewById<LinearLayout>(R.id.headerLayout).setBackgroundResource(bgColor)
        findViewById<LinearLayout>(R.id.footerLayout).setBackgroundResource(bgColor)
        activeJobsContainer.setBackgroundResource(bgColor)
        jobRequestsContainer.setBackgroundResource(bgColor)
        scheduledJobsContainer.setBackgroundResource(bgColor)

        // Update text colors of all job cards
        fun updateTextColor(container: LinearLayout) {
            for (i in 0 until container.childCount) {
                val card = container.getChildAt(i)
                card.findViewById<TextView>(R.id.tvJobTitle)?.setTextColor(resources.getColor(textColor))
                card.findViewById<TextView>(R.id.tvJobStatus)?.setTextColor(resources.getColor(textColor))
                card.findViewById<TextView>(R.id.tvJobTime)?.setTextColor(resources.getColor(textColor))
                card.findViewById<TextView>(R.id.tvJobLocation)?.setTextColor(resources.getColor(textColor))
            }
        }

        updateTextColor(activeJobsContainer)
        updateTextColor(jobRequestsContainer)
        updateTextColor(scheduledJobsContainer)
    }
}
