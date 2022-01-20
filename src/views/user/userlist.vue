<template>
 <div class="app-container">
      <div class="filter-container">
         <el-input v-model="listQuery.nickname" placeholder="昵称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
     <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" >
       <template slot-scope="{row}">
         <span>{{ row.id }}</span>
       </template>
     </el-table-column>

     <el-table-column label="用户" align="left">
       <template slot-scope="{row}">
         <div style="display: flex; align-items: center;">
           <img :src="row.avatar" alt="" style="height: 50px;border-radius: 50%">
           <span style="margin-left: 10px;">{{ row.nickname}}</span>
         </div>
       </template>
     </el-table-column>
     <el-table-column label="帐号类型" align="center">
       <template slot-scope="{row}">
         <span>{{ row.source_type ==1 ?'微信':'支付宝'}}</span>
       </template>
     </el-table-column>
     <el-table-column label="积分" align="center">
       <template slot-scope="{row}">
         <span>{{ row.integral}}</span>
       </template>
     </el-table-column>
     <el-table-column label="余额" align="center">
       <template slot-scope="{row}">
         <span>{{ row.balance}}</span>
       </template>
     </el-table-column>
     <el-table-column label="姓名" align="center">
       <template slot-scope="{row}">
         <span>{{ row.name}}</span>
       </template>
     </el-table-column>
     <el-table-column label="手机号" align="center">
       <template slot-scope="{row}">
         <span>{{ row.phone}}</span>
       </template>
     </el-table-column>
     <el-table-column label="注册时间" align="center" width="180px">
       <template slot-scope="{row}">
         <span>{{ row.created_at }}</span>
       </template>
     </el-table-column>
     <el-table-column label="操作" align="center" width="130" class-name="small-padding fixed-width">
       <template slot-scope="{row,$index}">

         <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
           删除
         </el-button>
       </template>
     </el-table-column>
   </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
</div>
</template>

<script>
   import { userList , delUser } from '@/api/user'
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
          nickname: undefined,
          times:undefined
        },
        temp: {
          id: undefined,
          name: '',
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

        userList(this.listQuery).then(response => {
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
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
          updateAccount(tempData.id,tempData).then(() => {
            const index = this.tableData.findIndex(v => v.id === this.temp.id)
            this.tableData.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '提示',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
          }
        })
      },

      handleDelete(index, row) {

        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delUser(index.id).then(response => {
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
