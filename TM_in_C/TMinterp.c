#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <limits.h>
#include <assert.h>
#include "TM.h"

#define MAXLINE 2048


int main() {
    entry *mappings = NULL;
    mappings = deltafromfile();
    if (mappings == NULL) {
        printf("Error, no such file exists\n");
        return 0;
    }


    char *Q = calloc(sizeof(char), MAXLINE);
    char *Sigma = calloc(sizeof(char), MAXLINE);
    char *Gamma = calloc(sizeof(char), MAXLINE);
    sprintf(Q,"q0 q1 q2 q3 q4 q_acc q_rej");
    sprintf(Sigma, "0 1");
    sprintf(Gamma, "0 1 _ #");

    TM *M = make_TM(Q, Sigma, Gamma,
        mappings, 20, "q_acc", "q_rej", "q0");

    run(M);

    free_TM(M);


    return 0;
}
