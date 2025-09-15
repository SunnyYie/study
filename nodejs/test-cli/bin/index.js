#!/usr/bin/env node
// 告诉操作系统使用 Node.js 运行此脚本

import { program } from 'commander'
import inquirer from 'inquirer'
import { checkPath } from '../src/util.js'
import download from 'download-git-repo'
import ora from 'ora'
import fs from 'fs'

const spinner = ora('下载中...')

let json = fs.readFileSync('./package.json')
json = JSON.parse(json)

program.version(json.version)

program
  .command('create <project-name>')
  .description('创建一个新项目')
  .action(async projectName => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: '请输入项目名称:',
        default: projectName,
      },
      {
        type: 'confirm',
        name: 'isTypescript',
        message: '是否使用 TypeScript?',
        default: true,
      },
    ])

    if (checkPath(answers.projectName)) {
      console.error('错误: 该路径已存在，请选择一个不同的项目名称。')
      return
    }

    if (answers.isTypescript) {
      spinner.start()
      download('direct:github:username/repo#branch', answers.projectName, err => {
        if (err) {
          console.error('下载模板失败:', err)
          return
        }
        spinner.stop()
      })
    } else {
      spinner.start()
      download('direct:github:username/repo#branch', answers.projectName, err => {
        if (err) {
          console.error('下载模板失败:', err)
          return
        }
        spinner.stop()
      })
    }
  })

// 定义命令和选项
program.parse(process.argv)
