#include "TM.h"
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>
#include <limits.h>
#include <assert.h>

#define MAXLINE 2048
#define ITEMSIZE 25








void free_entry(entry *ent) {
    free(ent->state);
    free(ent->sym);
    free(ent->q_new);
    free(ent->sym_new);
    free(ent);
}


void free_dict(dict *D) {
    for (size_t i = 0; i < D->len; i++) {
        entry *tmp = D->mappings[i];
        while (tmp != NULL) {
            entry *tmp2 = tmp->next;
            free_entry(tmp);
            tmp = tmp2;
        }
    }
    free(D->mappings);
    free(D);
}

void free_sets(sets *s) {
    for (size_t i = 0; i < s->len; i++) {
        free(s->set[i]);
    }
    free(s->set);
    free(s);
}

void free_TM(TM *M) {
    free_dict(M->delta);
    free_sets(M->Q);
    free_sets(M->Sigma);
    free_sets(M->Gamma);
    free(M);
}


void free_config(config *c) {
    free(c->u);
    free(c->v);
    free(c);
}


void free_confpath(confpath *P) {
    path *tmp = P->head;
    while (tmp != NULL) {
        path *tmp2 = tmp->next;
        free_config(tmp->trail);
        free(tmp);
        tmp = tmp2;
    }
    free(P);
}

void free_result(tm_result *R) {
    free_confpath(R->ans);
    free(R);
}

size_t hashfn(char *a, char *b, size_t len) {

    size_t len_a = strlen(a);
    size_t hash = 0;
    char h = b[0];
    size_t hh = (unsigned char)h;

    for (size_t i = 0; i < len_a; i++) {
        hash += 31*a[i];
        hash += 31*hh;
        hash = hash >> 1;
    }


    return hash % len;
}

entry *copy(entry *c) {
    entry *ret = malloc(sizeof(entry));
    ret->state = calloc(sizeof(char), strlen(c->state)+2);
    strcat(ret->state, c->state);
    ret->sym = calloc(sizeof(char), strlen(c->sym)+2);
    strcat(ret->sym, c->sym);
    ret->q_new = calloc(sizeof(char), strlen(c->q_new)+2);
    strcat(ret->q_new, c->q_new);
    ret->sym_new = calloc(sizeof(char), strlen(c->sym_new)+2);
    strcat(ret->sym_new, c->sym_new);
    ret->dir = c->dir;
    ret->next = NULL;
    ret->prev = NULL;
    return ret;
}


void insert_dict(dict *D, entry *add) {
    char *a = add->state;
    char *b = add->sym;
    size_t len = D->len;
    size_t i = hashfn(a, b, len);
    entry *node = copy(add);
    if (D->mappings[i] == NULL) {
        D->mappings[i] = node;
        D->mappings[i]->next = NULL;
        D->mappings[i]->prev = NULL;

    }
    else {
        node->next = D->mappings[i];
        D->mappings[i]->prev = node;
        D->mappings[i] = node;
        D->mappings[i]->prev = NULL;
    }
}


sets *format(char *str) {
    size_t count = 0;
    size_t len = strlen(str);
    for (size_t i = 0; i < len; i++) {
        if (str[i] == ' ') count++;
    }
    if (str[len-1] != ' ') count++;
    sets * ret = malloc(sizeof(sets));
    ret->len = count;
    char **s = calloc(sizeof(char*), count);
    count = 0;
    size_t count2 = 0;
    char hold[ITEMSIZE];
    memset(hold, 0, ITEMSIZE);
    for (size_t i = 0; i < len; i++) {
        if (str[i] != ' ') {
            hold[count] = str[i];
            count +=1;
        }
        else {
            s[count2] = strdup(hold);
            count2 += 1;
            count = 0;
            memset(hold, 0, ITEMSIZE);
        }
    }
    s[ret->len-1] = strdup(hold);
    ret->set = s;
    return ret;
}

TM *make_TM(char *Q, char *Sigma, char *Gamma, entry* delta, size_t dlen, char *q_acc, char *q_rej, char *q0) {
    TM *res = malloc(sizeof(TM));
    res->Q = format(Q);
    res->Sigma = format(Sigma);
    res->Gamma = format(Gamma);
    res->delta = make_dict(dlen, delta);
    res->q_acc = q_acc;
    res->q_rej = q_rej;
    res->q0 = q0;
    return res;
}



config *make_config(char *a, char *b, char *c) {
    config *res = malloc(sizeof(config));
    res->u = calloc(sizeof(char), strlen(a)+2);
    strcpy(res->u, a);
    res->q = b;
    res->v = calloc(sizeof(char), strlen(c)+2);
    strcpy(res->v, c);
    return res;
}


tm_result *make_result(confpath *P, enum Result done) {
    tm_result *res = malloc(sizeof(tm_result));

    res->ans = P;
    res->state = done;
    return res;
}

confpath *create_confpath() {
    confpath *ret = malloc(sizeof(confpath));
    ret->head = NULL;
    ret->tail = NULL;
    return ret;
}

void add_confpath(confpath *P, config *add) {
    if (P->head == NULL) {
        P->head = malloc(sizeof(path));
        P->head->trail = add;
        P->head->next = NULL;
        P->tail = P->head;
    }
    else {
        P->tail->next = malloc(sizeof(path));
        P->tail->next->trail = add;
        P->tail = P->tail->next;
        P->tail->next = NULL;
    }
}



dict *make_dict(size_t dlen, entry *fn_map) {
    dict *res = malloc(sizeof(dict));
    res->len = dlen;
    res->mappings = calloc(sizeof(entry), dlen);
    entry *tmp = fn_map;
    while (tmp != NULL) {
        entry *tmp2 = tmp->next;
        insert_dict(res,tmp);
        free_entry(tmp);
        tmp = tmp2;
    }

    return res;
}

entry *search_dict(dict *D, char *state, char *sym) {
    size_t i = hashfn(state, sym, D->len);
    for (entry *item = D->mappings[i]; item != NULL; item = item->next) {
        if (strcmp(state, item->state) == 0 && strncmp(sym, item->sym, 1) == 0) {
            return item;
        }
    }
    return NULL;
}


char *splice(char *a, char *b, int form) {
    char *hold = calloc(sizeof(char), MAXLINE);
    if (form == 0) {
        hold = strcat(hold,a);
        hold = strcat(hold, b+1);
    }
    else if (form == 1) {
        size_t len = strlen(a);
        hold[0] = a[len-1];
        hold = strcat(hold, b);
    }
    else if (form == 2) {
        size_t len = strlen(a);
        a[len-1] = '\0';
        hold = strcat(hold,a);
    }
    else if (form == 3) {
        hold = strcpy(hold, a);
        hold[strlen(hold)] = b[0];
    }
    else if(form == 4) {
        hold = strcat(hold, a+1);
    }
    else if (form == 5) {
        hold = strcat(hold, a);
        hold = strcat(hold, b);
    }
    return hold;
}

tm_result *TM_interpreter(TM *M, char *string, size_t k) {
    if (strlen(string) > 145) return NULL;
    if (!validate_TM(M)) return NULL;
    char *pass = calloc(sizeof(char), 2);
    char *pass2 = calloc(sizeof(char), strlen(string)+2);
    strcpy(pass2, string);
    config *init = make_config(pass, M->q0, pass2);
    free(pass);
    free(pass2);
    confpath *ret = create_confpath();
    size_t count = 0;

    while (true) {
        add_confpath(ret, init);
        if (strcmp(init->q, M->q_acc) == 0) {
            return make_result(ret, ACCEPT);
        }

        if (strcmp(init->q, M->q_rej) == 0) {
            return make_result(ret, REJECT);
        }
        if (count == k) {
            return make_result(ret, UNDETERMINED);
        }
        init = simulate_step(M, init);
        count += 1;
    }
}

config *simulate_step(TM *M, config *curr_conf) {
    char *u = curr_conf->u;
    char *q = curr_conf->q;
    char *v = curr_conf->v;
    char *u2 = "";
    char *v2 = "";

    if (strcmp(v, "") == 0) {
        v = strcat(v, "_");
    }

    entry *new = search_dict(M->delta, q, &v[0]);
    assert(new != NULL);
    size_t len;
    v2 = splice(new->sym_new, v, 0);

    char hold[MAXLINE];
    memset(hold, 0, MAXLINE);
    if (new->dir == 'L') {
        len = strlen(u);
        if (len != 0) {
            strcpy(hold, v2);
            free(v2);
            v2 = splice(u, hold, 1);
            u2 = splice(u,u, 2);
        }
        else {
            memset(hold, 0, MAXLINE);
            strcpy(hold, v2);
            free(v2);
            u2 = splice(u,u,5);
            v2 = splice("_", hold, 5);
        }
    }
    if (new->dir == 'R') {
        len = strlen(v);
        if (len != 0) {
            u2 = splice(u,v2,3);
            memset(hold,0, MAXLINE);
            strcpy(hold, v2);
            free(v2);
            v2 = splice(hold,hold, 4); 
        }
    }
    config *ret = make_config(u2, new->q_new, v2);
    free(v2);
    free(u2);
    return ret;
}

char *conv(config *e) {
    char *ret = calloc(sizeof(char), MAXLINE);
    sprintf(ret, "(%s, %s, %s), ", e->u, e->q, e->v);
    return ret;
}

void print_tuple(tm_result* P) {
    char *val = calloc(sizeof(char), MAXLINE*(MAXLINE/2));
    strcat(val, "[");
    for (path *i = P->ans->head; i != NULL; i = i->next) {
        char *add = conv(i->trail);
        strcat(val, add);
        free(add);
    }
    val[strlen(val)-1] = '\0';
    val[strlen(val)-1] = '\0';
    strcat(val, "]");
    if (P->state == ACCEPT) strcat(val, " ACCEPT\n");
    if (P->state == REJECT) strcat(val, " REJECT\n");
    if (P->state == UNDETERMINED) strcat(val, " UNDETERMINED\n");

    printf("%s", val);
    printf("strlen of val; %lu\n", strlen(val));
    free(val);
}

bool valid_string(char *chk, sets* gam) {
    if (chk == NULL) return false;
    size_t len = strlen(chk);
    if (len == 0) return false;
    char *mid = strstr(chk, ",");
    if (mid == NULL) return false;

    size_t i = 0;
    while ((chk+i) != mid) {
        //!in((void*)gam, (void*)(&chk[i]), CHAR)
        if (!in((void*)gam, (void*)(&chk[i]), CHAR)) {
            return false;
        }
        i += 1;
    }
    mid +=1;
    i = 0;
    if (mid[i] != '0' && atoi(mid) == 0) {
        return false;
    }
    return true;
}

size_t steps(char *str) {
    char *find = strstr(str, ",");
    find +=1;
    return (size_t)atoi(find);
}

char *in_string(char *str) {
    char *ret = calloc(sizeof(char), MAXLINE);
    size_t i = 0;
    while (str[i] != ',') {
        ret[i] = str[i];
        i += 1;
    }
    return ret;
}


void run(TM *M) {
    if (!validate_TM(M)) {
        printf("Error: Invalid TM\n");
        return;
    }
    char *test = calloc(sizeof(char), MAXLINE);
    while(true) {
        printf("Separate testcase and number of steps ran with ','\n");
        printf("Input Test Case: ");
        if (fgets(test,MAXLINE, stdin) == NULL) {
            printf("%s\n", test);
            printf("Error reading Test Case 1\n");
            break;
        }
        test[strlen(test)-1] = '\0';
        if (!valid_string(test,M->Gamma)) {
            printf("Error: Invalid form of Test Case\n");
            break;
        }
        char *input = in_string(test);
        tm_result *res = TM_interpreter(M, input, steps(test));
        if (res == NULL) {
            free(input);
            printf("Error: Invalid TM\n");
            break;
        }
        free(input);
        print_tuple(res);
        memset(test, 0, MAXLINE);

        printf("Continue?\nType [y/n]\n");
        fgets(test, MAXLINE, stdin);
        if (strcmp(test, "n\n") == 0 || strcmp(test, "N\n") == 0) {
            free_result(res);
            printf("\nGoodbye!! :)\n");
            break;
        }
        free_result(res);

        memset(test,0,MAXLINE);

    }

    free(test);
}

entry *add_delta(entry *map, char *q0, char *sym, char *q1, char *nsym, char dir) {

    entry *node = malloc(sizeof(entry));
        node->state = strdup((const char*)q0);
        node->sym = strdup((const char *)sym);
        node->q_new = strdup((const char *)q1);
        node->sym_new = strdup((const char*)nsym);
        node->dir = dir;
    if (map == NULL) {
        map = node;
        map->next = NULL;
        map->prev = NULL;
    }
    else {
        node->next = map;
        map->prev = node;
        node->prev = NULL;
        map = node;
    }
    return map;
}


TM *tmfromfile() {
    printf("Input file containing TM diagram\nof the format (q, sigma : q_new, sigma, direction)\nparantheses not included\n-->");
    char *filename = calloc(sizeof(char), MAXLINE);
    if (fgets(filename, MAXLINE, stdin) == NULL) {
        free(filename);
        printf("Error, no filename given\n");
        return NULL;
    }
    filename[strlen(filename)-1] = '\0';

    FILE *fd = fopen(filename, "r");
    if (fd == NULL) {
        free(filename);
        return NULL;
    }
    free(filename);
    char *line = calloc(sizeof(char), MAXLINE);

    printf("IMPORTANT:\nInput symbols that should not be in Sigma\nSeparate with ' '\n--> ");
    if (fgets(line,MAXLINE,stdin) == NULL) {
        free(line);
        fclose(fd);
        printf("Error, at least '_' should not be in Sigma\n");
        return NULL;
    }
    if (strstr(line, "_") == NULL) {
        printf("Error, at least '_' should not be in Sigma\n");
        fclose(fd);
        free(line);
        return NULL;
    }

    char Q[MAXLINE];
    char Sigma[MAXLINE];
    char Gamma[MAXLINE];
    char minus[MAXLINE];
    memset(Q, 0,MAXLINE);
    memset(Sigma, 0,MAXLINE);
    memset(Gamma, 0,MAXLINE);
    memset(minus, 0,MAXLINE);
    strcpy(minus,line);

    char state[ITEMSIZE];
    char sym[ITEMSIZE];
    char q[ITEMSIZE];
    char nsym[ITEMSIZE];
    char dir[ITEMSIZE];
    memset(state,0,ITEMSIZE);
    memset(sym, 0, ITEMSIZE);
    memset(q, 0, ITEMSIZE);
    memset(nsym, 0, ITEMSIZE);
    memset(dir,0,ITEMSIZE);
    entry *ret = NULL;
    int success = 0;

    while (fgets(line, MAXLINE, fd) != NULL) {
        success = sscanf(line,"%s %1s : %s %s %s", state, sym, q, nsym, dir);
        if (success != 5) {
            success = -1;
            printf("Error while parsing file for TM, format incorrect\n");
            break;
        }
        ret = add_delta(ret, state, sym, q, nsym, dir[0]);
        if (strstr(Q, state) == NULL) {
            strcat(Q, state);
            strcat(Q, " ");
        }
        if (strstr(Q, q) == NULL) {
            strcat(Q, q);
            strcat(Q, " ");
        }
        if (strstr(Sigma, sym) == NULL && strstr(minus, sym) == NULL) {
            strcat(Sigma, sym);
            strcat(Sigma, " ");
        }
        if (strstr(Gamma, sym) == NULL) {
            strcat(Gamma, sym);
            strcat(Gamma, " ");
        }
    }
    Q[strlen(Q)-1] = '\0';
    Sigma[strlen(Sigma)-1] = '\0';
    Gamma[strlen(Gamma)-1] = '\0';
    TM *M = NULL;
    
    if (ret != NULL && success == -1) {
        entry *tmp = ret;
        while (tmp != NULL) {
            entry *tmp2 =tmp->next;
            free_entry(tmp);
            tmp = tmp2;
        }
    }
    else {
        M = make_TM(Q, Sigma, Gamma, ret, 20, "q_acc", "q_rej","q0");
    }
    free(line); 
    fclose(fd);

    return M;

}

bool in(void *value, void *find, enum type var) {
    if (var == Q || var == SIGMA || var == GAMMA) {
        sets *states = (sets*)value;
        char *state = (char *)find;
        for (size_t i = 0; i < states->len; i++) {
            if (strcmp(states->set[i], state) ==  0) return true;
        }
        return false;
    }
    else if (var == CHAR) {
        sets *states = (sets*)value;
        char *chg = (char*)find;
        char val = chg[0];
        assert(strlen(&val) == 1);
        for (size_t i = 0; i < states->len; i++) {
            if (strcmp(states->set[i], &val) == 0) return true;
        }
        return false;
    }
    else {
        dict *D = (dict *)value;
        char *str = (char*)find;
        char *state = calloc(sizeof(char), MAXLINE);
        char *sym =calloc(sizeof(char), MAXLINE);
        if (sscanf(str, "%s %s", state, sym) != 2) {
            free(state);
            free(sym);
            return false;
        }
        if (search_dict(D, state, sym) == NULL) {
            free(state);
            free(sym);
            return false;
        }
        free(state);
        free(sym);
    }
    return true;
}


bool validate_TM(TM *M) {
    if (M == NULL) return false;
    if (M->Q == NULL) return false;
    if (M->Sigma == NULL) return false;
    if (M->Gamma == NULL) return false;
    if (M->delta == NULL) return false;
    if (M->q0 == NULL) return false;
    if (M->q_acc == NULL) return false;
    if (M->q_rej == NULL) return false;
    sets *Q = M->Q;
    sets *S = M->Sigma;
    sets *G= M->Gamma;
    
    if (Q->len == 0 || S->len == 0 || G->len == 0) return false;
    if (strcmp(M->q_acc, M->q_rej) == 0) return false;
    if (G->len <= S->len) return false;

    size_t chk = 0;
    for (size_t i = 0; i < Q->len; i++) {
        if (strcmp(Q->set[i], M->q0) == 0) chk+=1;
        if (strcmp(Q->set[i], M->q_acc) == 0) chk+=1;
        if (strcmp(Q->set[i], M->q_rej) == 0) chk +=1;
    }
    if (chk != 3) return false;
  

    for (size_t i = 0; i < S->len; i++) {
            if (!in((void*)G, (void*)S->set[i], GAMMA)) return false;
    }

    bool chk2 = false;
    for (size_t i = 0; i < G->len; i++) {
        if (!in((void*)S, (void*)G->set[i], SIGMA)) chk2 = true;
    }
    if (!chk2) return false;
    if (!in((void*)G, (void*)"_", GAMMA)) return false;
    if (in((void*)S, (void*)"_", SIGMA)) return false;

    bool halt = false;
    char hold[ITEMSIZE];
    memset(hold, 0, ITEMSIZE);
    printf("Gets here!\n");
    for (size_t i = 0; i < G->len; i++) {
        for (size_t j = 0; j < Q->len; j++) {
            if (strcmp(Q->set[j], M->q_acc) != 0 && strcmp(Q->set[j], M->q_rej) != 0) {
                sprintf(hold, "%s %s", Q->set[j], G->set[i]);
                if (in((void*)M->delta, (void*)hold, DELTA)) {
                    entry *ent = search_dict(M->delta, Q->set[j], G->set[i]);
                    int count = -1;
                    if (strcmp(M->q_acc, ent->q_new) == 0 || strcmp(M->q_rej, ent->q_new) == 0) halt = true;
                    for (size_t l = 0; l < Q->len; l++) {
                        if (strcmp(Q->set[l], ent->q_new) == 0) count = 1;
                    }
                    if (count == -1) return false;
                    if (!in((void*)G, (void*)ent->sym_new, GAMMA)) return false;
                    if (ent->dir != 'R' && ent->dir != 'L') return false;
                }
                else {
                    return false;
                }
                memset(hold, 0, ITEMSIZE);
            }
        }
    }
    if (!halt && strcmp(M->q0, M->q_acc) !=0 && strcmp(M->q0, M->q_rej) != 0) return false;

    memset(hold, 0, ITEMSIZE);
    char hold2[ITEMSIZE];
    memset(hold2, 0, ITEMSIZE);
    for (size_t i = 0; i < G->len; i++) {
        sprintf(hold, "%s %s", M->q_acc, G->set[i]);
        sprintf(hold2, "%s %s", M->q_rej, G->set[i]);
        if (in((void*)M->delta, (void*)hold, DELTA)) return false;
        if (in((void*)M->delta, (void*)hold2, DELTA)) return false;
        memset(hold,0,ITEMSIZE);
        memset(hold2,0,ITEMSIZE);
    }

    return true;
}