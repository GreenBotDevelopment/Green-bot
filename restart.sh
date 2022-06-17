#!/bin/bash

time=5s # s, m, h, d,
pm2=test # pm2 id or name

sleep $time
pm2 restart $pm2