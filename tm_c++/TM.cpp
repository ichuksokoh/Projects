#include <iostream>
#include <memory>
#include <list>
#include <string>
#include <stdio.h>
#include <time.h>
#include <fstream>
#include <limits>
#include <vector>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <set>
#include <list>
#include <assert.h>
#include <vector>
#include <cctype>
#include <stack>
#include <assert.h>
#include <algorithm>

#define MAXLINE 1024
#define TABLESIZE 30

using namespace std;

    //config struct
    struct uqv {
        string u;
        string q;
        string v;
    };


//class used to maintain visited configs
class config {
    list<uqv> path;
    string result;
    public:
        config () {
            path.clear();
        }
        config(string u, string q, string v) {
           insert(u,q,v);
        }
        void insert(string u, string q, string v) {
            uqv n;
            n.u = u;
            n.q = q;
            n.v = v;
            path.push_front(n);
        }
        void done (string s) {
            result = s;
        }
        void print() {
            path.reverse();
            cout << "[";
            for (auto i :path) {
                if (i.u != path.back().u and i.q != path.back().q and i.v != path.back().v) {
                    cout << "(" << i.u + "," + i.q + "," + i.v << "), ";
                }
                else {
                    cout << "("+ i.u + "," + i.q + "," + i.v + ")";
                }
            }
            cout << "] " << result << endl;
        }
        uqv  get() {
            uqv ret = path.front();
            uqv ans;
            ans.u = ret.u;
            ans.q = ret.q;
            ans.v = ret.v;
            return ans;
        }
        bool empty () {
            return path.empty();
        }

};


//class to maintain buckets in dictionary hash table when collisions occur
class bucket {
    void format(string all) {
        const char *s = all.c_str();
            char qt[MAXLINE];
            char symt[MAXLINE];
            char newqt[MAXLINE];
            char newsymt[MAXLINE];
            char dirt[MAXLINE];
            memset(qt, 0, MAXLINE);
            memset(symt, 0, MAXLINE);
            memset(newqt, 0, MAXLINE);
            memset(newsymt, 0, MAXLINE);
            memset(dirt, 0, MAXLINE);

            int count = sscanf(s,"%s %1s : %s %s %s", qt, symt, newqt, newsymt, dirt);
            if (count != 5) {
                return;
            }
            q = qt;
            sym = symt;
            newq = newqt;
            newsym = newsymt;
            dir = dirt;
    }
    public:
        string q;
        string sym;
        string newq;
        string newsym;
        string dir;
        bucket *next;
        bucket () {
            q  = "";
            sym = q;
            newq = q;
            newsym = q;
            dir = q;
            next = nullptr;
        }
        bucket (string all) {
            format(all);
            next = nullptr;
        }
        bucket (string q, string sym, string newq, string newsym, string dir) {
            this->q = q;
            this->newq = newq;
            this->sym = sym;
            this->newsym = newsym;
            this->dir = dir;
            next = nullptr;
        }
        bool valid() {
            if (q == sym and newq == sym and newsym == dir) return false;
            return true;
        }
        
};


//dictionary used to store delta mappings
class dict {
        size_t hash(string str) {
            unsigned long hash = 5381;
            for (char c : str) {
                hash = ((hash << 5) + hash) + c; 
            }
            return hash % len;
        }
        size_t len;
    public:
        bucket **D;
        dict () {
            len = TABLESIZE;
            D = new bucket *[len];
            for (size_t i = 0; i < len; i++) {
                D[i] = nullptr;
            }
        }
        dict (size_t length) {
            len = length;
            D = new bucket *[len];
        }
        bool insert(string s) {
            bucket *node = new bucket(s);
            if (!node->valid()) {
                delete node;
                return false;
            }
            string h = node->q + node->sym;
            size_t index = hash(h);
            if (D[index] == nullptr) {
                D[index] = node;
            }
            else {
                node->next = D[index];
                D[index] = node;
            }
            return true;
        }
        bucket *search_dict(string q, string sym) {
            string s = q + sym;
            size_t index = hash(s);
            for (bucket *i = D[index]; i != nullptr; i = i->next) {
                if (i->q == q && i->sym == sym) {
                    return i;
                }
            }
            return nullptr;
        }

        size_t glen() {
            return len;
        }
        ~dict () {
                for (size_t i = 0; i < len; i++) {
                    bucket *tmp = D[i];
                    while (tmp != nullptr) {
                        bucket *tmp2 = tmp->next;
                        delete tmp;
                        tmp = tmp2;
                    }
                }
                delete[] D;
        }

};

/**
 * Turing machine class contains seven-tuple
 * making up turing machines
*/
class TM {

    public:
        set<string> Q;
        set<string> sigma;
        set<string> gamma;
        dict delta;
        string q0;
        string q_acc;
        string q_rej;
        string not_in;
        
        TM() {
            q0 = "";
            q_acc = "";
            q_rej = "";
            Q.clear();
            sigma.clear();
            gamma.clear();
        }
        TM(set<string> states, set<string> sig, set<string> gam, dict d, string q0, string q_acc, string q_rej) {
            Q.merge(states);
            sigma.merge(sig);
            gamma.merge(gam);
            this->q0 = q0;
            this->q_acc = q_acc;
            this->q_rej = q_rej;
            delta = d;
        }
        void setter(string line) {
            const char *s = line.c_str();
            char qt[MAXLINE];
            char symt[MAXLINE];
            char newqt[MAXLINE];
            char newsymt[MAXLINE];
            char dirt[MAXLINE];
            memset(qt, 0, MAXLINE);
            memset(symt, 0, MAXLINE);
            memset(newqt, 0, MAXLINE);
            memset(newsymt, 0, MAXLINE);
            memset(dirt, 0, MAXLINE);
            int count = sscanf(s,"%s %1s : %s %s %s", qt, symt, newqt, newsymt, dirt);
            if (count != 5) {
                return;
            }

            Q.insert(qt);
            Q.insert(newqt);
            if (not_in.find(string(symt)) == string::npos) {
                sigma.insert(symt);
            }
            gamma.insert(symt);
        }

        bool valid_input(string s) {
            bool flip = false;
            for (char i :s) {
                string t;
                if (i ==',') flip = true;
                if (!flip and i != ',') {
                    t.push_back(i);
                    if (gamma.find(t) == gamma.end()) return false;
                    t.clear();
                }
                else {
                    if (!isdigit(i) and (i != ',' and i != ' ')) {
                        return false;
                    }
                }
            }
            return true;
        }

        void simulate_steps(config& c) {
            uqv top = c.get();
            if (top.v.empty()) {
                top.v += "_";
            }
            char d = top.v[0];
            string cc;
            cc.push_back(d);
            bucket *chg =  delta.search_dict(top.q,cc);
            top.v = string(chg->newsym) + top.v.substr(1,top.v.length());

            if (chg->dir == "L") {
                if (top.u.length() != 0) {
                    top.v = top.u[top.u.length()-1] + top.v;
                    top.u = top.u.substr(0, top.u.length()-1);
                }
                else {
                    top.v = "_" + top.v;
                }
            }
            else {
                if (top.v.length() != 0) {
                    top.u = top.u + top.v[0];
                    top.v = top.v.substr(1, top.v.length());
                }
            }
            top.q = chg->newq;
            c.insert(top.u,top.q,top.v);
        }

        config interpret(string s, size_t steps) {
            config p(string(""),q0,s);
            size_t count = 0;
            while (true) {
                uqv chk = p.get();
                if (chk.q == q_acc) {
                    p.done("ACCEPT");
                    return p;
                }
                if (chk.q == q_rej) {
                    p.done("REJECT");
                    return p;
                }
                if (steps != string::npos && count == steps) {
                    p.done("UNDETERMINED");
                    return p;
                }
                if (steps != string::npos) count += 1;
                simulate_steps(p);
            }
        }

        bool validate_tm() {
            size_t qlen = Q.size(), slen = sigma.size(), glen = gamma.size();
            if (qlen == 0 or slen == 0 or glen == 0) return false;
            if (q_acc == q_rej) return false;
            if (glen <= slen) return false;
            if(Q.find(q_acc) == Q.end() or Q.find(q_rej) == Q.end() 
                or Q.find(q0) == Q.end()) return false;
            
            for (string var :sigma) {
                if (gamma.find(var) == gamma.end()) return false;
            }

            if (gamma.find("_") == gamma.end() or sigma.find("_") != sigma.end()) return false;

            bool halt = false;
            for (string var: gamma) {
                for (string state: Q) {
                    if (state != q_acc and state != q_rej) {
                        bucket *value = delta.search_dict(state,var);
                        if (value == nullptr) return false;
                        else {
                            if (value->newq == q_acc or value->newq == q_rej) halt = true;
                            if (Q.find(value->newq) == Q.end()) return false;
                            if (gamma.find(value->newsym) == gamma.end()) return false;
                            if (value->dir != "L" and value->dir != "R") return false;
                        }
                    }
                }
            }
            if (!halt and q0 != q_acc and q0 != q_rej) return false;

            for (string var: gamma) {
                if (delta.search_dict(q_acc, var) != nullptr) return false;
                if (delta.search_dict(q_rej, var) != nullptr) return false;
            }
            return true;
        }
};


bool valid_syms(string& str) {
    if (str.empty()) return false;
    if (str.find('_') == string::npos) return false;
    return true;
}


void tmfromfile(TM& m) {
    L3:
        cout << "File please!" << endl;
        string file;
        getline(cin,file);
        string line;
        ifstream f;
        f.open(file.c_str());
       
    L2:
        if(f.is_open()) {
            cout << "symbols not in Sigma, separated with a space\n";;
            getline(cin,m.not_in);
            if (!valid_syms(m.not_in)) {
                cout << "Symbols not in Sigma should at least contain '_' \n";
                goto L2;
            }
            while(getline(f,line, '\n')) {
                    m.delta.insert(line);
                    m.setter(line);
            }
        }
        else {
            cout << "File Not Found\n";
            goto L3;
        }
        m.q0 = "q0";
        m.q_acc = "q_acc";
        m.q_rej = "q_rej";
        assert(m.Q.find(m.q_rej) != m.Q.end());
        assert(m.Q.find(m.q_acc) != m.Q.end());
        f.close();
}


void run(TM& m) {
    if (!m.validate_tm()) {
        cout << "Value of validate_tm check: ";
        cout << "notin string " + m.not_in << endl;
        cout << std::boolalpha;
        cout << m.validate_tm()  << "\n";
        cout << "Invalid TM fix and try again \n";
        return;
    }
    //run TM interpreter until client is satisfied with test cases
    while(true) {
        L1:
            string input;
            input.clear();
            cout << "Input test cases here\n";
            getline(cin, input);
            if (!m.valid_input(input)) {
                cout << "Error: invalid testcase\n";
                goto L1;
            }

            size_t comma = input.find(',');
            size_t steps;
            if (comma == input.npos) {
                steps = input.npos;
                comma = input.length();
            }
            else {
                if (input[comma+1] == ' ') steps = (size_t)(stoi(input.substr(comma+2,input.length()-1),nullptr));
                else steps = (size_t)(stoi(input.substr(comma+1, input.length()-1),nullptr));
            }
            cout << "value of steps: " << steps << endl;
            input = input.substr(0,comma);
            cout << "input is: " << input << endl;
            config result = m.interpret(input,steps);
            result.print();
        L2:
            string cont;
            cout << "Continue?\n" << "[Y/n]\n";
            getline(cin, cont);
            string nterm = "y yes";
            string term = "n no";
            std::transform(cont.begin(), cont.end(), cont.begin(), [](unsigned char c) {
                return std::tolower(c);
            });
            if (term.find(cont) != string::npos) return;
            else {
                if (nterm.find(cont) != string::npos) {
                    
                }
                else {
                    cout << "Try Again\n";
                    goto L2;
                }
            }
    }


}


int main () {

TM some;
tmfromfile(some);
run(some);
cout << "Done ;)\n";


return 0;
}


