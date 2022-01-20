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
                <el-option label="待付款" value="1"></el-option>
                <el-option label="待发货" value="2"></el-option>
                <el-option label="待收货" value="3"></el-option>
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

     <el-table-column label="订单状态" align="center" width="100">
       <template slot-scope="{row}">
         <span style="color:#3888FA;">
            {{ row.status ==1 ?'待付款':''}}
            {{ row.status ==2 ?'待发货':''}}
            {{ row.status ==3 ?'待收货':''}}
            {{ row.status ==4 ?'已完成':''}}
         </span>
       </template>
     </el-table-column>
     <el-table-column label="联系人" align="center" width="100">
       <template slot-scope="{row}">
         <span>{{ row.name}}</span>
       </template>
     </el-table-column>
     <el-table-column label="上门地址" align="center" width="280">
       <template slot-scope="{row}">
         <span>{{ row.address}}</span>
       </template>
     </el-table-column>
     <el-table-column label="联系电话" align="center" width="120">
       <template slot-scope="{row}">
         <span>{{ row.phone}}</span>
       </template>
     </el-table-column>

     <el-table-column label="兑换商品名称" align="center"  width="180">
       <template slot-scope="{row}">
         <span>{{ row.goods_info.title}}</span>
       </template>
     </el-table-column>

     <el-table-column label="兑换商品数量" align="center"  width="120">
       <template slot-scope="{row}">
         <span>{{ row.goods_qty}}</span>
       </template>
     </el-table-column>

     <el-table-column label="扣除积分" align="center"  width="120">
       <template slot-scope="{row}">
         <span>{{ row.paid_integral}}</span>
       </template>
     </el-table-column>

     <el-table-column label="下单时间" align="center" width="180px">
       <template slot-scope="{row}">
         <span>{{ row.created_at }}</span>
       </template>
     </el-table-column>
     <el-table-column label="操作" fixed="right" align="center" width="160" class-name="small-padding fixed-width">
       <template slot-scope="{row,$index}" >
<!--               <el-button v-if="row.status == 2 " type="primary"  size="mini" @click="handleModifyStatus(row,3)">
                      点击上门
                   </el-button>

                   <el-button v-if="row.status  ==3  " type="success"  size="mini" @click="handleModifyStatus(row,4)">
                          点击核验
                       </el-button> -->

        <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(row)"></el-button>
         <el-button v-if="row.status!='deleted'" icon="el-icon-delete"  circle type="danger" @click="handleDelete(row,$index)">

         </el-button>
       </template>
     </el-table-column>
   </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
          <el-form ref="dataForm"  :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
            <el-form-item label="发货商品" >
              <el-input  v-model="temp.goods_title" disabled />
            </el-form-item>
            <el-form-item label="发货数量"  >
              <el-input type="number" v-model="temp.goods_qty" disabled />
            </el-form-item>
            <el-form-item label="快递公司" >
              <el-input  v-model="temp.express"/>
            </el-form-item>
            <el-form-item label="快递单号" >
              <el-input  v-model="temp.express_num"/>
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
   import { getConvertOrderList, updateConvertOrder, delConvertOrder } from '@/api/order'
   import waves from '@/directive/waves' // waves directive
   import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  export default {
    components: { Pagination },
     directives: { waves },
    data() {
      return {
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
          status:'',
          goods_title:'',
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

        getConvertOrderList(this.listQuery).then(response => {
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
        this.temp.goods_title = row.goods_info.title
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },

      updateHandleOrder(){
        console.log(this.temp);
        updateConvertOrder(this.temp.id,this.temp).then(response => {
          if(this.temp.status == 2 && this.temp.express && this.temp.express_num){
            this.temp.status = 3
          }
          console.log('data',this.temp)

           const index = this.tableData.findIndex(v => v.id === this.temp.id)
            this.tableData.splice(index, 1, this.temp)
              this.dialogFormVisible = false
        this.$notify({
          message: '成功',
          type: 'success',
          duration: 3000
        })

        })
      },

      handleModifyStatus(row, status) {
        this.temp.status = status
        this.$confirm('确定操作此订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateConvertOrder(row.id,this.temp).then(response => {
          row.status = status
          this.$notify({
            message: '成功',
            type: 'success',
            duration: 2000
          })

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
      //     updateConvertOrder(tempData.id,tempData).then(() => {
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
          delConvertOrder(index.id).then(response => {
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
