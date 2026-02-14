package com.example.lawntrammer

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.LinearLayout
import android.widget.RadioGroup
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class SignUpActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sign_up)   // 👈 ADD THIS

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val radioGroup = findViewById<RadioGroup>(R.id.radioGroupUser)
        val layoutServiceProvider = findViewById<LinearLayout>(R.id.layoutServiceProvider)

        radioGroup.setOnCheckedChangeListener { _, checkedId ->

            if (checkedId == R.id.rbProvider) {
                layoutServiceProvider.visibility = View.VISIBLE
            } else {
                layoutServiceProvider.visibility = View.GONE
            }
        }

        val tvBackToLogin = findViewById<TextView>(R.id.tvBackToLogin)

        tvBackToLogin.setOnClickListener {
            finish()   // 👈 This will close SignUpActivity and go back
        }

    }


}