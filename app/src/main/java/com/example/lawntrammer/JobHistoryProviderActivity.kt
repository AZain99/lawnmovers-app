

package com.example.lawntrammer

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.widget.ImageView
import android.widget.LinearLayout
import androidx.appcompat.app.AppCompatActivity
import com.example.lawntrammer.EarningsActivity

class JobHistoryProviderActivity : AppCompatActivity() {

    private lateinit var btnJobs: LinearLayout
    private lateinit var btnHome: LinearLayout

    private lateinit var btnPayments: LinearLayout
    private lateinit var btnProfile: LinearLayout
    private var darkMode = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_job_history_provider)

        initViews()
        setupListeners()


        val toggleTheme = findViewById<ImageView>(R.id.toggleTheme)

        toggleTheme.setOnClickListener {
            darkMode = !darkMode
            val root = findViewById<androidx.constraintlayout.widget.ConstraintLayout>(R.id.rootLayout)
            if (darkMode) {
                root.setBackgroundColor(Color.parseColor("#0D1117"))
                toggleTheme.setImageResource(R.drawable.ic_sun)
            } else {
                root.setBackgroundColor(Color.parseColor("#FFFFFF"))
                toggleTheme.setImageResource(R.drawable.ic_moon)
            }
        }
    }
    private fun initViews() {
        btnHome = findViewById(R.id.navHome)
        btnPayments = findViewById(R.id.navPayments)
        btnJobs = findViewById(R.id.navJobs)
        btnProfile = findViewById(R.id.navProfile)



    }
    private fun setupListeners() {
        btnHome.setOnClickListener {
            val intent = Intent(this, ProviderDashboardActivity::class.java)
            startActivity(intent)
        }
        btnPayments.setOnClickListener {
            val intent = Intent(this, EarningsActivity::class.java)
            startActivity(intent)
        }
//
        btnProfile.setOnClickListener {
            val intent = Intent(this, ProviderProfileActivity::class.java)
            startActivity(intent)
        }


    }

}
