import pymysql

# Patch PyMySQL as MySQLdb for MySQL database integration
try:
    pymysql.install_as_MySQLdb()
except Exception:
    pass

