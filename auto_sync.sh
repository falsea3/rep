#!/bin/bash

# Путь к проекту
PROJECT_DIR="C:\Users\user\Desktop\rep"  # Замените на реальный путь к вашему проекту

# Переход в директорию проекта
cd $PROJECT_DIR

# Добавление всех изменений
git add .

# Коммит с текущей датой и временем
git commit -m "Auto-update: $(date +'%Y-%m-%d %H:%M:%S')"

# Пуш на GitHub
git push origin master
