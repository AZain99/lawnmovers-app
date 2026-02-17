package com.example.lawntrammer

import android.os.Bundle
import android.widget.ImageButton
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.app.AppCompatDelegate
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView

class ScheduleActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_schedule)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
        val recyclerView = findViewById<RecyclerView>(R.id.recyclerJobs)
        recyclerView.layoutManager = LinearLayoutManager(this)

        val jobs = listOf(
            Job("Front Lawn - Weekly", "123 Main St", "Today at 02:00 PM", "Start Job",),
            Job("Front Lawn - Weekly", "123 Main St", "Today at 02:00 PM", "Completed",),
            Job("Front Lawn - Weekly", "123 Main St", "Tomorrow at 02:00 PM", "Start Job",)
        )
        recyclerView.adapter = JobAdapter(jobs)
        val btnTheme = findViewById<ImageButton>(R.id.btnTheme)
        btnTheme.setOnClickListener {
            val current = AppCompatDelegate.getDefaultNightMode()
            if (current == AppCompatDelegate.MODE_NIGHT_YES) {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
            } else {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
            }
        }
    }
}