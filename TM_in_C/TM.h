#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>
#include <limits.h>



/**
 * @brief section 1: Declaration of structs
 * structs used in construction and manpiulation of TM simulator 
 * 
 */



/**
 * @brief used to verify what type the in function is taking in (specified later)
 * allows for generic search function that doubles as a boolean check
 * 
 */
enum type {
    Q,
    SIGMA,
    GAMMA,
    DELTA
};

enum Result {
    ACCEPT,
    REJECT,
    UNDETERMINED,
};


typedef struct node entry;
struct node {
    char *state;
    char *sym;
    char *sym_new;
    char dir;
    char *q_new;
    entry *next;
    entry *prev;
};




typedef struct dict dict;
struct dict {
    size_t len;
    entry **mappings;
};


typedef struct TM TM;
struct TM {
    char *Q;
    char *Sigma;
    char *Gamma;
    dict *delta;
    char *q_acc;
    char *q_rej;
    char *q0;
};

typedef struct configurations config;
struct configurations {
    char *u;
    char *q;
    char *v;
};

typedef struct comp_path path;
struct comp_path {
    config *trail;
    path *next;
};

typedef struct pwrap confpath;
struct pwrap {
    path *head;
    path *tail;
};

typedef struct result tm_result;
struct result {
    enum Result state;
    confpath *ans;
};



/**
 * @brief Section 2: Functions used in construction, destruciton, and manipulation
 * of Turing Machine simulators
 * 
 */


/**
 * @brief free a entry object
 * 
 * @param ent entry to be freed
 */
void free_entry(entry *ent);

/**
 * @brief Frees allocated TM
 * 
 * @param M TM to be freed
 */
void free_TM(TM *M);

/**
 * @brief frees allocated dictionary used to store delta mappings for a 
 * particular TM
 * 
 * @param D delta dictionary to be freed
 */
void free_dict(dict *D);


/**
 * @brief Used in free_paths to free configurations 
 * 
 * @param c configurations to be freed
 */
void free_config(config *c);

void free_confpath(confpath *P);

void free_result(tm_result *R);

/**
 * @brief Hash function for particular delta of a particular
 * TM machine
 * 
 * @param a the state q delta takes in
 * @param b the symbol that delta takes
 * @param len length of delta dictionray to obtain index after
 * a succesful hash
 * @return size_t 
 */
size_t hashfn(char *a, char *b, size_t len);

char *splice(char *a, char *b, int form);
entry *fill_fn();


dict *make_dict(size_t dlen, entry *fn_map);
config *make_config(char *a, char *b, char *c);
confpath *create_confpath();
TM *make_TM(char *Q, char *Sigma, char *Gamma, entry* delta, size_t dlen, char *q_acc, char *q_rej, char *q0);


entry *search_dict(dict *D, char *state, char *sym);
bool in(void *value, enum type var);
bool validate_TM(TM *M);


void insert_dict(dict *D, entry *add);
void add_confpath(confpath *P, config *add);
tm_result *make_result(confpath *P, enum Result done);


void print_tuple(path *P, enum Result done);

void input(char *in);

config *simulate_step(TM *M, config *curr_conf);
tm_result *TM_interpreter(TM *M, char *string, size_t k);

