<template>
    <el-card class="box-card">
        <!--面包屑-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>地区管理 (选中状态下，为服务地区，可以下单)</el-breadcrumb-item>

        </el-breadcrumb>
          <el-tree
            :data="treeData"
            show-checkbox
            node-key="id"
            :props="defaultProps"
            :default-expanded-keys="selectedData"
            :default-checked-keys="selectedData"
            @check="clickDeal">
          </el-tree>

          <el-row style="text-align: center;">

             <el-button type="primary" @click="onSubmit">立即保存</el-button>

          </el-row>
    </el-card>

</template>

<script>
import {  districtList,storeDistrict} from '@/api/district'
    export default {
      //  name: "Category",
        data() {
            return {
                defaultProps: {
                  children: 'children',
                  label: 'district_name'
                },
                treeData: [],
                selectedData:[],

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
                districtList().then(res => {
                    this.treeData = this.arraytotree(res.data.data);
                    this.selectedData = res.data.selectData;
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


            clickDeal (currentObj, treeStatus) {
              // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
              //let selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中
              console.log('选中的数据',treeStatus['checkedKeys'])
              this.selectedData = treeStatus['checkedKeys'];

            },

            onSubmit(){

              storeDistrict(this.selectedData).then(response => {
                  this.$message({
                    message: '保存成功',
                    type: 'success'
                  })

                }
              );
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
