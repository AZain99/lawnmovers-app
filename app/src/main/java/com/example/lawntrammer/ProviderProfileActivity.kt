package com.example.lawntrammer

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.view.Gravity
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.google.android.flexbox.FlexboxLayout

class ProviderProfileActivity : AppCompatActivity() {

    private lateinit var tvJobs: TextView
    private lateinit var tvEarnings: TextView
    private lateinit var tvHours: TextView
    private lateinit var skillsFlow: FlexboxLayout
    private lateinit var tvUpload: TextView

    private lateinit var btnPayments: ImageView
    private lateinit var btnJobs: ImageView
    private lateinit var btnHome: ImageView





    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_provider_profile)

        tvJobs = findViewById(R.id.tvJobs)
        tvEarnings = findViewById(R.id.tvEarnings)
        tvHours = findViewById(R.id.tvHours)
        skillsFlow = findViewById(R.id.skillsFlow)
        tvUpload = findViewById(R.id.tvUpload)


        btnJobs = findViewById(R.id.btnJobs)
        btnPayments = findViewById(R.id.btnPayments)
        btnHome = findViewById(R.id.btnHome)



        // Sample data
        tvJobs.text = "120"
        tvEarnings.text = "$5200"
        tvHours.text = "180h"

        val skills = listOf("Lawn Mowing", "Trimming", "Leaf Blowing", "Edging")
        addSkills(skills)

        tvUpload.setOnClickListener {
            Toast.makeText(this, "Uploading documents...", Toast.LENGTH_SHORT).show()
        }

        btnJobs.setOnClickListener {
            startActivity(Intent(this, JobHistoryProviderActivity::class.java))
        }

        btnPayments.setOnClickListener {
            startActivity(Intent(this, EarningsActivity::class.java))
        }
        btnHome.setOnClickListener {
            startActivity(Intent(this, ProviderDashboardActivity::class.java))
        }
    }

    private fun addSkills(skills: List<String>) {
        skillsFlow.removeAllViews()

        skills.forEach { skill ->
            val tv = TextView(this)
            tv.text = skill
            tv.setTextColor(Color.WHITE)
            tv.setPadding(24, 12, 24, 12)
            tv.background = ContextCompat.getDrawable(this, R.drawable.bg_skill)
            tv.gravity = Gravity.CENTER

            val params = FlexboxLayout.LayoutParams(
                FlexboxLayout.LayoutParams.WRAP_CONTENT,
                FlexboxLayout.LayoutParams.WRAP_CONTENT
            )
            params.setMargins(8, 8, 8, 8)
            tv.layoutParams = params

            skillsFlow.addView(tv)
        }
    }
}
