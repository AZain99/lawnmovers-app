package com.example.lawntrammer

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.button.MaterialButton

class JobAdapter(private val jobList: List<Job>) :
    RecyclerView.Adapter<JobAdapter.JobViewHolder>() {

    class JobViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val title: TextView = itemView.findViewById(R.id.tvTitle)
        val location: TextView = itemView.findViewById(R.id.tvLocation)
        val time: TextView = itemView.findViewById(R.id.tvTime)
        val button: MaterialButton = itemView.findViewById(R.id.btnStatus)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): JobViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.activity_itemjob, parent, false)
        return JobViewHolder(view)
    }

    override fun getItemCount() = jobList.size

    override fun onBindViewHolder(holder: JobViewHolder, position: Int) {
        val job = jobList[position]

        holder.title.text = job.title
        holder.location.text = job.location
        holder.time.text = job.time

        if (job.status == "Completed") {
            holder.button.visibility = View.GONE
        } else {
            holder.button.text = job.status
        }
    }
}
