package com.example.lawntrammer

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.constraintlayout.widget.ConstraintLayout
import com.example.lawntrammer.EarningsActivity

class NavigateJobActivity : AppCompatActivity() {


    private lateinit var btnJobs: ImageView
    private lateinit var btnPayments: ImageView
    private lateinit var btnProfile: ImageView
    private lateinit var btnHome: ImageView
    private var darkMode = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_navigate_job)

        initViews()
        setupListeners()


        val root = findViewById<ConstraintLayout>(R.id.rootLayout)
        val btnTheme = findViewById<ImageView>(R.id.btnTheme)

        // Get job data from intent
        val jobTitle = intent.getStringExtra("jobTitle") ?: "N/A"
        val jobLocation = intent.getStringExtra("jobLocation") ?: "N/A"
        val jobTime = intent.getStringExtra("jobTime") ?: "N/A"

        findViewById<TextView>(R.id.tvJobTitle)?.text = jobTitle
        findViewById<TextView>(R.id.tvJobLocation)?.text = jobLocation
        findViewById<TextView>(R.id.tvJobTime)?.text = jobTime

        // Dark/light theme toggle
        btnTheme.setOnClickListener {
            darkMode = !darkMode
            if (darkMode) {
                root.setBackgroundColor(Color.parseColor("#0D1117"))
                btnTheme.setImageResource(R.drawable.ic_sun)
            } else {
                root.setBackgroundColor(Color.WHITE)
                btnTheme.setImageResource(R.drawable.ic_moon)
            }
        }
    }

    private fun initViews() {


        btnHome = findViewById(R.id.btnHome)
        btnJobs = findViewById(R.id.btnJobs)
        btnPayments =  findViewById(R.id.btnPayments)
        btnProfile =  findViewById(R.id.btnProfile)



    }
    private fun setupListeners() {
        btnHome.setOnClickListener {
            val intent = Intent(this, ProviderDashboardActivity::class.java)
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

}
