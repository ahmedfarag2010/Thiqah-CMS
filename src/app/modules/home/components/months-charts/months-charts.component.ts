import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { XhrService } from '../../../../shared/services/xhr/xhr.service';


@Component({
  selector: 'app-months-charts',
  templateUrl: './months-charts.component.html',
  styleUrl: './months-charts.component.scss',
  standalone: true,
  imports: [ChartModule]
})
export class MonthsChartsComponent implements OnInit {

  constructor(private XhrService: XhrService) {

  }

  data: any
  options: any


  ngOnInit() {
    this.getTransactionsStatisticsByMonth()
  }



  statisticsData: any = []
  getTransactionsStatisticsByMonth() {
    this.XhrService.get(`v1/transaction/get-all-transactions-by-month-count`).subscribe(res => {
      if (res.data) {
        this.statisticsData = res.data
        // append fake data
        // for (let i = 0; i < this.statisticsData.length; i++) {
        //   this.statisticsData[i].icoming = 25,
        //   this.statisticsData[i].outgoing = 20,
        //   this.statisticsData[i].archived = 15,
        //   this.statisticsData[i].refused = 10,
        //   this.statisticsData[i].copied = 5
        // }
        // Charts data str
        this.data = {
          labels: [],
          datasets: [
            {
              label: 'الوارد',
              backgroundColor: '#5877EA',
              borderColor: '#5877EA',
              data: [],
              fill: false,
            },
            {
              label: 'الصادر',
              backgroundColor: '#58EACA',
              borderColor: '#58EACA',
              data: [],
              fill: false,
            },
            {
              label: 'الأرشيف',
              backgroundColor: '#85D2F0',
              borderColor: '#85D2F0',
              data: [],
              fill: false,
            },
            {
              label: 'المرفوض',
              backgroundColor: '#EA5877',
              borderColor: '#EA5877',
              data: [],
              fill: false,
            },
            {
              label: 'النسخ',
              backgroundColor: '#EACA58',
              borderColor: '#EACA58',
              data: [],
              fill: false,
            },
          ]
        };

        // Charts options
        this.options = {
          maintainAspectRatio: false,
          aspectRatio: 0.7,
          plugins: {
            tooltip: {
              mode: 'index',
              intersect: false
            },
            
          },
          scales: {
            x: {
                stacked: true,
                ticks: {
                },
                grid: {
                    drawBorder: false
                }
            },
            y: {
                stacked: true,
                grid: {
                    drawBorder: false
                }
            }
        }
        };
        console.log(this.statisticsData)
        // Append data
        for (let i = 0; i < this.statisticsData.length; i++) {
          this.data.labels.push(this.statisticsData[i].monthText)
          this.data.datasets[0].data.push(this.statisticsData[i].transactionCount.incoming)
          this.data.datasets[1].data.push(this.statisticsData[i].transactionCount.outgoing)
          this.data.datasets[2].data.push(this.statisticsData[i].transactionCount.archived)
          this.data.datasets[3].data.push(this.statisticsData[i].transactionCount.refused)
          this.data.datasets[4].data.push(this.statisticsData[i].transactionCount.copied)
        }
        console.log(this.data)
      }
    })
  }

}
