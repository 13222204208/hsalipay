<template>
 <div class="app-container">
      <div class="filter-container">
         <el-input v-model="listQuery.orderNum" placeholder="订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
           <el-date-picker
        v-model="listQuery.times"
        value-format="yyyy-MM-dd"
        style="left: 10px;"
        type="daterange"
        unlink-panels
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
    ></el-date-picker>

          <el-select v-model="listQuery.status" placeholder="请选择订单状态" style="width: 200px; left: 20px;" >
                <el-option label="待报价" value="1"></el-option>
                <el-option label="待上门" value="2"></el-option>
                <el-option label="待核验" value="3"></el-option>
                <el-option label="已完成" value="4"></el-option>
          </el-select>

         <el-button v-waves class="filter-item" type="primary" style="margin-left: 30px;" icon="el-icon-search" @click="handleFilter">
           搜索
         </el-button>

      </div>
      <br>
   <el-table
     :key="tableKey"
    :data="tableData"
    v-loading="listLoading"
     border
     fit
     highlight-current-row
     style="width: 100%;"
   >
     <el-table-column label="ID" fixed="left" prop="id" sortable="custom" align="center" width="80" >
       <template slot-scope="{row}">
         <span>{{ row.id }}</span>
       </template>
     </el-table-column>

     <el-table-column label="订单号" align="center" width="155">
       <template slot-scope="{row}">
            <span>{{ row.order_num}}</span>
       </template>
     </el-table-column>
     <el-table-column label="订单来源" align="center" width="100">
       <template slot-scope="{row}">
         <span>{{ row.source_type ==1 ?'微信':'支付宝'}}</span>
       </template>
     </el-table-column>
     <el-table-column label="回收类别" align="center" width="120">
       <template slot-scope="{row}">
         <span>{{ row.classify.title}}</span>
       </template>
     </el-table-column>
     <el-table-column label="订单状态" align="center" width="100">
       <template slot-scope="{row}">
         <span style="color:#3888FA;">
            {{ row.status ==1 ?'待报价':''}}
            {{ row.status ==2 ?'待上门':''}}
            {{ row.status ==3 ?'待核验':''}}
            {{ row.status ==4 ?'已完成':''}}
             {{ row.status == -1 ?'已取消':''}}
         </span>
       </template>
     </el-table-column>
     <el-table-column label="是否确认" align="center" width="100">
       <template slot-scope="{row}">
         <span style="color:#3888FA;">
             {{ (row.classify.id ==3 ||row.classify.id ==4) && row.confirm == 1  ?'已确认报价':''}}
         </span>
       </template>
     </el-table-column>
     <el-table-column label="联系人" align="center" width="100">
       <template slot-scope="{row}">
         <span>{{ row.recy_name}}</span>
       </template>
     </el-table-column>
     <el-table-column label="上门地址" align="center" width="280">
       <template slot-scope="{row}">
         <span>{{ row.recy_address}}</span>
       </template>
     </el-table-column>
     <el-table-column label="上门日期" align="center" width="150">
       <template slot-scope="{row}">
         <span>{{ row.recy_time}}</span>
       </template>
     </el-table-column>
     <el-table-column label="联系电话" align="center" width="120">
       <template slot-scope="{row}">
         <span>{{ row.recy_phone}}</span>
       </template>
     </el-table-column>
     <el-table-column label="预计重量" align="center" width="120">
       <template slot-scope="{row}">
         <span>{{ row.estimate_weight}} {{row.classify.unit}}</span>
       </template>
     </el-table-column>

     <el-table-column label="实际重量" align="center" width="120">
       <template slot-scope="{row}">
         <span>{{ row.fact_weight}} {{row.classify.unit}}</span>
       </template>
     </el-table-column>

     <el-table-column label="预计收益" align="center" width="120">
       <template slot-scope="{row}">
         <span>{{ row.estimate_income}}</span>
       </template>
     </el-table-column>

     <el-table-column label="实际收益" align="center" width="120">
       <template slot-scope="{row}">
         <span>{{ row.fact_income}}</span>
       </template>
     </el-table-column>

     <el-table-column label="提交时间" align="center" width="180px">
       <template slot-scope="{row}">
         <span>{{ row.created_at }}</span>
       </template>
     </el-table-column>
     <el-table-column label="操作" fixed="right" align="center" width="220" class-name="small-padding fixed-width">
       <template slot-scope="{row,$index}" >
               <el-button v-if="row.status == 2 " type="primary"  size="mini" @click="handleModifyStatus(row,3)">
                      点击上门
                   </el-button>

                   <el-button v-if="row.status  ==3  " type="success"  size="mini" @click="handleModifyStatus(row,4)">
                          点击核验
                       </el-button>

        <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(row)"></el-button>
         <el-button v-if="row.status!='deleted'" icon="el-icon-delete"  circle type="danger" @click="handleDelete(row,$index)">

         </el-button>
       </template>
     </el-table-column>
   </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
          <el-form ref="dataForm"  :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
            <el-form-item label="预计收益" >
              <el-input  v-model="temp.estimate_income"><template slot="append">元</template> </el-input>
            </el-form-item>
            <el-form-item label="实际重量"  >
              <el-input type="number" v-model="temp.fact_weight"><template slot="append">{{temp.unit}}</template> </el-input>
            </el-form-item>
            <el-form-item label="实际收益" >
              <el-input type="number" v-model="temp.fact_income"><template slot="append">元</template> </el-input>

              <el-form-item label="点击查看" v-if=" url != '' ">
                  <div class="demo-image__preview">
                     <br>
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="url"
                      :preview-src-list="srcList">
                    </el-image>
                  </div>
                  <div>
                    物品名称：{{orderInfo.name}} <br>
                    物品状态：{{orderInfo.status}} <br>
                    使用年限：{{orderInfo.use_year}}
                  </div>

              </el-form-item>

            </el-form-item>
            <el-form-item label="Remark">
              <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">

            <el-button type="primary" @click="updateHandleOrder()">
              保存
            </el-button>
          </div>
        </el-dialog>

</div>
</template>

<script>
   import { getRecyOrderList, updateRecyOrder, delRecyOrder } from '@/api/order'
   import waves from '@/directive/waves' // waves directive
   import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  export default {
    components: { Pagination },
     directives: { waves },
    data() {
      return {
        url: '',
        srcList: [],
        orerInfo:null,
        tableKey: 0,
        tableData:null,
        listLoading: true,
        total: 0,
        listQuery: {
          page: 1,
          limit: 20,
          orderNum: undefined,
          times:undefined,
          status:undefined
        },
        temp: {
          unit:'',
          status:''
        },
        dialogPvVisible: false,
        dialogFormVisible: false,
        dialogStatus: '',
        pvData: [],
        textMap: {
          update: '编辑',
          create: 'Create'
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true

        getRecyOrderList(this.listQuery).then(response => {
          this.tableData = response.data.item;
          this.total = response.data.total;

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 500)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        console.log('订单详情',this.temp)
        if(this.temp.status == -1){
          this.$message({
            type: 'info',
            message: '订单已取消'
          });
          return false;
        }
        this.url = ""
        this.srcList =[]
        this.orderInfo = null
        if(this.temp.recy_photo != null ){
          var str=process.env.VUE_APP_BASE_API;
           var  leg= str.indexOf('api');
             var url= str.substr(0,leg);
           var imgUrl = JSON.parse(this.temp.recy_photo);

           var imgFilesList = []
           for (let i = 0; i < imgUrl.length; i++) {
             imgFilesList.push(
               url+ imgUrl[i],
             );
           }
          this.url = imgFilesList[0]
          this.srcList = imgFilesList
        }

        if(this.temp.order_info != null){
          console.log('infofinf',this.temp.order_info)
          this.orderInfo = JSON.parse(this.temp.order_info)
        }

        this.temp.unit = row.classify.unit
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },

      updateHandleOrder(){
        updateRecyOrder(this.temp.id,this.temp).then(response => {
          if(this.temp.status == 1 && this.temp.estimate_income){
            this.temp.status = 2
          }
          console.log('datadata',this.temp)

                 const index = this.tableData.findIndex(v => v.id === this.temp.id)
                 this.tableData.splice(index, 1, this.temp)
                 console.log('updatedata',this.temp)
                   this.dialogFormVisible = false
                 this.$notify({
                   message: '成功',
                   type: 'success',
                   duration: 3000
                 })


        }).catch(() => {

          })
      },

      handleModifyStatus(row, status) {
        this.$confirm('确定操作此订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.temp.status = status
           console.log('')
          updateRecyOrder(row.id,this.temp).then(response => {
            console.log(response)
          if(response.code == 1){
            row.status = status

            this.$notify({
              message: '成功',
              type: 'success',
              duration: 2000
            })
          }
          }).catch(() => {
            console.log(232343)
            this.temp.status = status -1
            console.log('tempstatus',this.temp.status)
              row.status = status -1
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
        // console.log('数据',row, status)
        //     this.$message({
        //       message: '操作Success',
        //       type: 'success'
        //     })
        //     row.status = status
          },

      // updateData() {
      //   this.$refs['dataForm'].validate((valid) => {
      //     if (valid) {
      //       const tempData = Object.assign({}, this.temp)
      //     updateRecyOrder(tempData.id,tempData).then(() => {
      //       const index = this.tableData.findIndex(v => v.id === this.temp.id)

      //       if(this.temp.status == 1 && this.temp.estimate_income){
      //         this.temp.status = 2
      //       }
      //       console.log('data',this.temp)
      //       this.tableData.splice(index, 1, this.temp)
      //       this.dialogFormVisible = false
      //       this.$notify({
      //         title: '提示',
      //         message: '修改成功',
      //         type: 'success',
      //         duration: 2000
      //       })
      //     })
      //     }
      //   })
      // },

      handleDelete(index, row) {

        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delRecyOrder(index.id).then(response => {
          this.$notify({
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.tableData.splice(row, 1)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      }
    }
  }
</script>
