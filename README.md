# fragments

Cloud Computing for Programmers

lint
npm run lint

ESLint helps to find problems in the code. The script runs and then indicates where errors in the code arise.

start
npm start

dev
npm run dev

debug
num run debug

Since I am running Windows and Windows has a curl command built in Powershell, I will encounter an error if I were
to use the curl command. Instead, I will need to call the executable file curl.exe.

Examples done in the lab:

1.  curl localhost:8080 -> Leads to a curl : The URI prefix is not recognized.
    Solution:
    curl.exe localhost:8080

2.  curl -s localhost:8080 | jq
    Solution
    curl.exe -s localhost:8080 | jq

3.  curl -i localhost:8080
    Solution
    curl.exe -i localhost:8080
