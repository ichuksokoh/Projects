#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <limits.h>
#include <assert.h>
#include "TM.h"

#define MAXLINE 2048


tm_result *TM_interpreter(TM *M, char *string, size_t k) {
    if (strlen(string) > 145) return NULL;
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


int main() {
    entry *mappings = NULL;
    mappings = fill_fn();


    char *Q = calloc(sizeof(char), MAXLINE);
    char *Sigma = calloc(sizeof(char), MAXLINE);
    char *Gamma = calloc(sizeof(char), MAXLINE);
    sprintf(Q,"q0 q1 q2 q3 q4 q_acc q_rej");
    sprintf(Sigma, "0 1");
    sprintf(Gamma, "0 1 _ #");

    TM *M = make_TM(Q, Sigma, Gamma,
        mappings, 20, "q_acc", "q_rej", "q0");
    

    tm_result *result = TM_interpreter(M, "10010011110011100011100011100000110110101010", 20000);

    if (result == NULL) {
        free_TM(M);
        return 0;
    }
    print_tuple(result->ans->head, result->state);

    free_result(result);
    free_TM(M);


    return 0;
}
