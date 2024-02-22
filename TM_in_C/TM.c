#include "TM.h"
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>
#include <limits.h>
#include <assert.h>

#define MAXLINE 2048




void assign(entry *fn, char *state, char *sym, char* q_new, char *new_sym, char dir) {
    fn->dir = dir;
    fn->sym = calloc(sizeof(char), strlen(sym)+2);
    strcat(fn->sym, sym);
    fn->q_new = calloc(sizeof(char), strlen(q_new)+2);
    strcat(fn->q_new, q_new);
    fn->state = calloc(sizeof(char), strlen(state)+2);
    strcat(fn->state, state);
    fn->sym_new = calloc(sizeof(char), strlen(new_sym)+2);
    strcat(fn->sym_new, new_sym);
}

entry *fill_fn() {
    entry *deltafn = malloc(sizeof(entry));
    entry *tmp = deltafn;
    assign(deltafn, "q0", "0", "q1", "#", 'R');
    tmp->next = malloc(sizeof(entry));
    tmp = tmp->next;
    assign(tmp, "q0", "1", "q4", "1", 'R');
    tmp->next = malloc(sizeof(entry));
    tmp = tmp->next;
    assign(tmp, "q0", "_", "q_acc", "_", 'R');
    tmp->next = malloc(sizeof(entry));
    tmp = tmp->next;
    assign(tmp, "q0", "#", "q0", "#", 'R');
    

    tmp->next = malloc(sizeof(entry));
    tmp = tmp->next;
    assign(tmp, "q1", "0", "q1", "0", 'R');
    tmp->next = malloc(sizeof(entry));
    tmp = tmp->next;
    assign(tmp, "q1", "1", "q2", "#", 'L');
    tmp->next = malloc(sizeof(entry));
    tmp = tmp->next;
    assign(tmp, "q1", "#", "q1", "#", 'R');
    tmp->next = malloc(sizeof(entry));
    tmp = tmp->next;
    assign(tmp, "q1", "_", "q3", "_", 'L');


    tmp->next = malloc(sizeof(entry));
    tmp = tmp->next;
    assign(tmp, "q2", "0", "q2", "0", 'L');
    tmp->next = malloc(sizeof(entry));
    tmp = tmp->next;
    assign(tmp, "q2", "1", "q2", "1", 'L');
    tmp->next = malloc(sizeof(entry));
    tmp = tmp->next;
    assign(tmp, "q2", "#", "q2", "#", 'L');
    tmp->next = malloc(sizeof(entry));
    tmp = tmp->next;
    assign(tmp, "q2", "_", "q0", "_", 'R');

    tmp->next = malloc(sizeof(entry));
    tmp = tmp->next;
    assign(tmp, "q3", "0", "q3", "0", 'L');
    tmp->next = malloc(sizeof(entry));
    tmp = tmp->next;
    assign(tmp, "q3", "1", "q2", "#", 'L');
    tmp->next = malloc(sizeof(entry));
    tmp = tmp->next;
    assign(tmp, "q3", "#", "q3", "#", 'L');
    tmp->next = malloc(sizeof(entry));
    tmp = tmp->next;
    assign(tmp, "q3", "_", "q_rej", "_", 'R');

    tmp->next = malloc(sizeof(entry));
    tmp = tmp->next;
    assign(tmp, "q4", "0", "q1", "#", 'R');
    tmp->next = malloc(sizeof(entry));
    tmp = tmp->next;
    assign(tmp, "q4", "1", "q4", "1", 'R');
    tmp->next = malloc(sizeof(entry));
    tmp = tmp->next;
    assign(tmp, "q4", "#", "q4", "#", 'R');
    tmp->next = malloc(sizeof(entry));
    tmp = tmp->next;
    assign(tmp, "q4", "_", "q_rej", "_", 'L');
    tmp->next = NULL;
    return deltafn;
}






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

void print_tuple(path *P, enum Result done) {
    char *val = calloc(sizeof(char), MAXLINE*(MAXLINE/2));
    strcat(val, "[");
    for (path *i = P; i != NULL; i = i->next) {
        char *add = conv(i->trail);
        strcat(val, add);
        free(add);
    }
    strcat(val, "]");
    if (done == ACCEPT) strcat(val, " ACCEPT\n");
    if (done == REJECT) strcat(val, " REJECT\n");
    if (done == UNDETERMINED) strcat(val, " UNDETERMINED\n");

    printf("%s", val);
    printf("strlen of val; %lu\n", strlen(val));
    free(val);
}


