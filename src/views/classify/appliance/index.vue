<template>
    <el-card class="box-card">
        <!--面包屑-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>家电管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button @click="addCategoryDialog()" style="margin-top: 20px">增加</el-button>
        <!--新增一级对话框-->
        <el-dialog
                title="新增一级"
                :visible.sync="addDialogVisible"
                width="30%"
        >
            <el-form ref="form" :model="addForm" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
            </el-form>
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitCategory">确 定</el-button>
        </el-dialog>
        <!--tree-->
        <el-tree
                :props="defaultProps"
                :data="treeData"
                show-checkbox
                node-key="id"
                :default-expand-all="false"
                :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
            <el-button
                    type="text"
                    size="mini"
                    @click="() => append(data.id)">
            增加
          </el-button>
          <el-button
                  type="text"
                  size="mini"
                  @click="() => remove(data.id)">
            删除
          </el-button>
            <el-button
                    type="text"
                    size="mini"
                    @click="() => edit(data.id,data.name,data.income, data.pid)">
            编辑
          </el-button>
        </span>
      </span>
        </el-tree>

        <!--新增子菜单对话框-->
        <el-dialog
                title="新增子菜单"
                :visible.sync="addCategoryBypidDialogVisible"
                width="30%"
        >
            <el-form ref="form" :model="addForm" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="预计收益">
                    <el-input v-model="addForm.income"></el-input>
                </el-form-item>
            </el-form>
            <el-button @click="addCategoryBypidDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitCategoryBypid">确 定</el-button>
        </el-dialog>


        <!--编辑节点对话框-->
        <el-dialog
                title="编辑"
                :visible.sync="editCategoryBypidDialogVisible"
                width="30%"
        >
            <el-form ref="form"  label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="name"></el-input>
                </el-form-item>
                <el-form-item v-if=" pid >0 " label="预计收益">
                    <el-input v-model="income"></el-input>
                </el-form-item>
            </el-form>
            <el-button @click="editCategoryBypidDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitEditCategoryById">确 定</el-button>
        </el-dialog>
    </el-card>
</template>

<script>
import { storeAppliance, applianceList, updateAppliance, delAppliance} from '@/api/appliance'
    export default {
      //  name: "Category",
        data() {
            return {
                treeData: [],
                defaultProps: {
                    label: function(a, b){
                      console.log('label数据',a ,b)
                      if(a.pid === 0){
                        return a.name
                      }else{
                        return a.name  + "："+ a.income+ "元"
                      }

                    }
                },
                addDialogVisible: false,
                addForm: {
                    name: '',
                    income:0,
                    pid:0
                },
                addCategoryBypidDialogVisible:false,
                pid:'',
                id:'',
                name:'',
                income:'',
                editCategoryBypidDialogVisible:false


            }
        },
        created() {
            this.getlist();

        },
        methods: {
            /**
             * 获取数据
             */
            getlist() {
                applianceList().then(res => {
                    this.treeData = this.arraytotree(res.data);
                    console.log('树形数据',this.treeData)
                }).catch(res => {

                })

            },
            handleNodeClick(data) {
                console.log(data);
            },

            //数组转化为树
            arraytotree(arr) {
                var top = [], sub = [], tempObj = {};
                arr.forEach(function (item) {
                    if (item.pid === 0) { // 顶级分类
                        top.push(item)
                    } else {
                        sub.push(item) // 其他分类
                    }
                    item.children = []; // 默然添加children属性
                    tempObj[item.id] = item // 用当前分类的id做key，存储在tempObj中
                })

                sub.forEach(function (item) {
                    // 取父级
                    var parent = tempObj[item.pid] || {'children': []}
                    // 把当前分类加入到父级的children中
                    parent.children.push(item)
                })

                return top
            },

            addCategoryDialog() {
                this.addDialogVisible = true;
            },
            /**
             * 新增一级目录
             */
            submitCategory(){
                console.log('一级',this.addForm);
                storeAppliance(this.addForm).then(res=>{
                    if (res.code===1){
                        this.$message({
                            type: 'success',
                            message: '新增一级目录成功'
                        });
                        this.addForm={}
                        this.addDialogVisible=false
                        this.getlist();
                    }else{
                        this.addForm={}
                        this.addDialogVisible=false
                        this.getlist();
                    }
                }).catch(res=>{

                })
            },

            append(id) {
                this.id=id

                this.addCategoryBypidDialogVisible=true;
            },

            /**
             * 新增子节点
             */
            submitCategoryBypid(){
                //把新增子节点的pid设置为获取到的节点id
                this.addForm.pid = this.id
                console.log('子类',this.addForm)

                storeAppliance(this.addForm).then(res=>{
                    if (res.code===1){
                        this.$message({
                            type:'success',
                            message:'新增成功'
                        })
                        this.addCategoryBypidDialogVisible=false;
                        this.addForm={}
                        this.getlist();
                    }
                }).catch(res=>{

                })
            },


            /**
             * 通过id删除节点
             * @param id
             */
            remove(id) {
                console.log(id)
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    delAppliance(id).then(res=>{
                        if (res.data===1){
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            });

                        }
                        this.getlist();
                    }).catch(res=>{

                    })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });
                });


            },

            edit(id,name,income,pid) {
                console.log(name)
                this.id=id;
                this.name=name;
                this.income = income;
                this.pid = pid
                this.editCategoryBypidDialogVisible=true;
            },

            /**
             * 根据id编辑节点
             */
            submitEditCategoryById(){
              console.log('编辑',this.addForm)
              this.addForm.name = this.name
              this.addForm.income = this.income
                updateAppliance(this.id, this.addForm).then(res=>{
                    if (res.code===1){
                        this.$message({
                            type: 'success',
                            message: '更新成功'
                        });
                        this.addForm={}
                        this.editCategoryBypidDialogVisible=false
                        this.getlist();
                    }else{
                        this.$message({
                            type: 'error',
                            message: '更新失败'
                        });
                        this.addForm={}
                        this.editCategoryBypidDialogVisible=false
                        this.getlist();
                    }
                }).catch(res=>{

                })
            }
        }
    }
</script>

<style scoped>
    .el-tree {
        margin-top: 20px;
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>
