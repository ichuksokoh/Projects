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

void free_TM(TM *M) {
    free_dict(M->delta);
    free(M->Q);
    free(M->Sigma);
    free(M->Gamma);
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

TM *make_TM(char *Q, char *Sigma, char *Gamma, entry* delta, size_t dlen, char *q_acc, char *q_rej, char *q0) {
    TM *res = malloc(sizeof(TM));
    res->Q = Q;
    res->Sigma = Sigma;
    res->Gamma = Gamma;
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

bool valid_string(char *chk) {
    if (chk == NULL) return false;
    size_t len = strlen(chk);
    if (len == 0) return false;
    char *mid = strstr(chk, ",");
    if (mid == NULL) return false;

    size_t i = 0;
    while ((chk+i) != mid) {
        if (chk[i] != '1' && chk[i] != '0') {
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
        if (!valid_string(test)) {
            printf("Error reading Test Case 2\n");
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

entry *deltafromfile() {
    printf("Input file containing TM diagram\nof the format (q, sigma : q_new, sigma, direction)\n-->");
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

    char *state = calloc(sizeof(char),ITEMSIZE);
    char *sym = calloc(sizeof(char), ITEMSIZE);
    char *q = calloc(sizeof(char), ITEMSIZE);
    char *nsym = calloc(sizeof(char), ITEMSIZE);
    char *dir = calloc(sizeof(char),ITEMSIZE);
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
        memset(state, 0, ITEMSIZE);
        memset(sym, 0, ITEMSIZE);
        memset(q, 0, ITEMSIZE);
        memset(nsym, 0, ITEMSIZE);
        memset(dir, 0, ITEMSIZE);
        memset(line, 0, MAXLINE);
    }


    if (ret != NULL && success == -1) {
        entry *tmp = ret;
        while (tmp != NULL) {
            entry *tmp2 =tmp->next;
            free_entry(tmp);
            tmp = tmp2;
        }
    }
    free(line); free(state);
    free(sym); free(q);
    free(nsym); free(dir);

    fclose(fd);

    return ret;

}

bool in(void *value, void *find, enum type var) {
    if (var == Q || var == SIGMA || var == GAMMA) {
        char *states = (char*)value;
        char *state = (char *)find;
        if (strstr(states, state) == NULL) {
            return false;
        }
    }
    else {
        dict *D = (dict *)value;
        char *state = calloc(sizeof(char), MAXLINE);
        char *sym =calloc(sizeof(char), MAXLINE);
        if (sscanf(find, "%s %s", state, sym) != 2) {
            return false;
        }
        if (search_dict(D, state, sym) == NULL) {
            return false;
        }
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

    size_t slen = strlen(M->Sigma);
    size_t glen = strlen(M->Gamma);
    size_t qlen = strlen(M->Q);
    if (slen == 0 || glen == 0 || qlen == 0) return false;
    if (strcmp(M->q_acc,M->q_rej) == 0) return false;
    if (slen >= glen) return false;

    if(strstr(M->Q,M->q0) == NULL || strstr(M->Q,M->q_acc) == NULL 
        || strstr(M->Q,M->q_rej) == NULL) {
        return false;
    }

    if(strstr(M->Gamma,M->Sigma) == NULL) return false;
    if(strstr(M->Q, M->Gamma) != NULL) return false;

    size_t i = 0;
    char hold[ITEMSIZE];
    char hold2[ITEMSIZE];
    memset(hold, 0, ITEMSIZE);
    memset(hold2, 0, ITEMSIZE);
    strcat(hold, M->q_acc);
    strcat(hold, M->q_rej);
    strcat(hold, " ");
    strcat(hold2, " ");
    size_t len = strlen(hold);
    size_t len2 = strlen(hold2);
    size_t j = len;
    size_t k = len2;
    char *g = M->Gamma;
    while (g[i] != '\0') {
        if (g[i] == ' ') {
            if (in((void*)M->delta, (void*)hold, DELTA)) return false;
            if (in((void*)M->delta, (void*)hold, DELTA)) return false;
            j = len;
            k = len2;
        }
        else {
            hold[j] = g[i];
            hold2[k] = g[i];
        }
        i += 1;
        j += 1;
        k += 1;
    }
    return true;
}