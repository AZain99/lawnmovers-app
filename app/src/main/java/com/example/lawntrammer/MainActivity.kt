package com.example.lawntrammer

import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText
import android.util.Patterns


class MainActivity : AppCompatActivity() {

    private lateinit var etEmail: TextInputEditText
    private lateinit var etPassword: TextInputEditText
    private lateinit var btnLogin: MaterialButton
    private lateinit var btnGoogle: MaterialButton
    private lateinit var tvCreateAccount: TextView  // add this

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

        // handle insets
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        initViews()
        setListeners()
    }

    private fun initViews() {
        etEmail = findViewById(R.id.etEmail)
        etPassword = findViewById(R.id.etPassword)
        btnLogin = findViewById(R.id.btnLogin)
        btnGoogle = findViewById(R.id.btnGoogle)
        tvCreateAccount = findViewById(R.id.tvCreateAccount) // initialize here
    }

    private fun setListeners() {

        btnLogin.setOnClickListener {

            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()

            // 1️⃣ Check Empty Fields
            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please enter email and password", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // 2️⃣ Validate Email Pattern
            if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                Toast.makeText(this, "Enter valid email address", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // 3️⃣ Validate Password Pattern
            val passwordPattern =
                Regex("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d@\$!%*?&]{8,}$")

            if (!passwordPattern.matches(password)) {
                Toast.makeText(
                    this,
                    "Password must be 8+ chars, include upper, lower & digit",
                    Toast.LENGTH_LONG
                ).show()
                return@setOnClickListener
            }

            // 4️⃣ Routing Based on First Letter
            if (email.startsWith("C", true)) {
                val intent = Intent(this, ServiceBookingActivity::class.java)
                startActivity(intent)
            } else {
                val intent = Intent(this, ProviderDashboardActivity::class.java)
                startActivity(intent)
            }
        }
        btnGoogle.setOnClickListener {
            Toast.makeText(this, "Google Login clicked", Toast.LENGTH_SHORT).show()

        }

        // ✅ Create Account click
        tvCreateAccount.setOnClickListener {
            val intent = Intent(this, SignUpActivity::class.java)
            startActivity(intent)
        }

    }
}
