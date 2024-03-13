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
    DELTA,
    CHAR
};

/**
 * @brief defines how the the turing machine terminted, either accepted, rejected, or could not be
 * determined in k number of steps
*/
enum Result {
    ACCEPT,
    REJECT,
    UNDETERMINED,
};


/**
 * @struct entry
 * Defines how the delta function mappings are handled for a given TM
*/
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



/**
 * @struct dict
 * How the delta function is defined as a hash table of entry structs
 * containing all mappings used for delta
*/
typedef struct dict dict;
struct dict {
    size_t len;
    entry **mappings;
};


/**
 * @struct sets
 * Used to control how Sigma, Gamma, and Q are defined
 * an array of strings corresponding to some particular set defined for each Sigma, Gamma, and Q
*/
typedef struct sets sets;
struct sets {
    char **set;
    size_t len;
};


/**
 * @struct TM
 * contains the seven tuple that defiens a turing machine and verified (defined later) for correctness
*/
typedef struct TM TM;
struct TM {
    sets *Q;
    sets *Sigma;
    sets *Gamma;
    dict *delta;
    char *q_acc;
    char *q_rej;
    char *q0;
};


/**
 * @struct config
 * handles the output configuartions of a TM given each step the corresponding u,q,v is
 * stored in this struct as three tuple of strings
*/
typedef struct configurations config;
struct configurations {
    char *u;
    char *q;
    char *v;
};

/**
 * @struct path
 * After TM runs on test case this is used to contain all the configs that appeared
 * in running the TM
*/
typedef struct comp_path path;
struct comp_path {
    config *trail;
    path *next;
};


/**
 * @struct confpath
 * A wrapper struct to make it easier to manipulate the path struct
 * in a more efficient manner when adding configurations to the path struct
*/
typedef struct pwrap confpath;
struct pwrap {
    path *head;
    path *tail;
};


/**
 * @struct result
 * contains the configurations that a TM, M, output while running on a particular test
 * case as well as if the TM accepted, rejected, or could not determine the result in 
 * a specified number of steps
*/
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


/**
 * @brief Used to free the struct containing all the configurations
 * @param p the linked list containing all the configurations to be freed
*/
void free_confpath(confpath *P);

/**
 * @brief Used to free the result of a TM that contains the
 * configuration linked list (confpath) 
 * @param R the result to be freed
*/
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


/**
 * @brief a string manipulation function
 * that mimics functionalities of string operations
 * seen in python
 * @param a string to be operated on
 * @param b second string to be operated on
 * @param form type of string manipulation operation
 * @return new string formed from a particular string manipulation operation
 * @note form can be 0 to 5 for 6 different operation types
 * @note 0 - concats a with b[:1] equivalent in python i.e. a concat with b except for b's first character
 * @note 1 - concats the last character of a with the entirety of b
 * @note 2 - returns a with the last character removed
 * @note 3 - concats a with the first character of b
 * @note 4 - returns a with the first character removed
 * @note 5 - concats a and b together
*/
char *splice(char *a, char *b, int form);

/**
 * @brief consturction of dictionary given a valid linked list of entries (mappings)
 * and a desired table size for number of buckets
 * @param dlen number of buckets in hash table dictionary
 * @param fn_mp valid mappings for delta function
 * @return hash table dictionary with delta mappigns in buckets
*/
dict *make_dict(size_t dlen, entry *fn_map);

/**
 * @brief constructs a u,q,v configuration given three strings
 * @param a first string in u,q,v
 * @param b second string in u,q,v
 * @param c third and final string in u,q,v
 * @return empty linked list
*/
config *make_config(char *a, char *b, char *c);

/**
 * @brief creates an empty path linked list with the confpath wrap struct
 * @return empty path linked list to be filled
*/
confpath *create_confpath();

/**
 * @brief given a correct seven tuple that is read from the input file
 * constructs a TM that will be checked afterwards for its correctness
 * @param Q string of states of TM (should include iniital, accepting, and rejecting states)
 * @param Sigma string of the alphabet that TM decides
 * @param Gamma string of the union of the alphabet, Sigma, and any additional characters TM uses for it's opeartions
 * in it's delta function mappings (i.e. blank symbol)
 * @param delta the valid mappings of a particular delta function for a TM
 * @param q_acc aaccepting state of TM should also be in Q (substring)
 * @param q_rej rejecting state of TM should also be in a Q (substring)
 * @param q0 initial state of TM should also be in a Q (substring)
 * @return a TM that can be given inputs to run
*/
TM *make_TM(char *Q, char *Sigma, char *Gamma, entry* delta, size_t dlen, char *q_acc, char *q_rej, char *q0);


/**
 * @brief given a state and symbol searches dict for corresponding mapping i.e f(x,y) where f is delta
 * @param D hash table dictionary that corresponds to some delta function that contains mappings
 * @param state first part of key used to search dict
 * @param sym second part of key used to search dict
 * @return a pointer to a valid entry from dictionary if mapping exists NULL otherwise
 * @note state and sym are both used as follows f(state,sym) when finding the corresponding
 * hash table index for a mapping
*/
entry *search_dict(dict *D, char *state, char *sym);

/**
 * @brief mimics in function of python by taking in arbitrary
 * structs, value, and checking if a some object, find, is in the struct
 * @param value a void pointer to a struct that contains objects of some type
 * @param find an object of some type that may be in value
 * @param var the type of struct and object that should be expected in the void pointers
 * @return true or false for if some object is indeed in the struct given the underlying
 * types are correct
*/
bool in(void *value, void *find, enum type var);

/**
 * @brief checks a TM for correctness and that it is well defined
 * if failed here TM is invalid and cannot be used to run test cases on inputs
 * @param M TM to be checked
 * @return true or false if M is a valid and well defined TM
*/
bool validate_TM(TM *M);


/**
 * @brief inserts an entry into a hash table dictionary that represents some delta function
 * with it's mappings in the buckets of the table
 * @param D hash table that entry containing mappings is being added to
 * @param add entry that is being inserted into the table D
*/
void insert_dict(dict *D, entry *add);

/**
 * @brief adds configurations to the path struct
*/
void add_confpath(confpath *P, config *add);

/**
 * @brief constructs a tm_result struct given a linked list of configurations
 * and a result type
 * @param P the configurations
 * @param done the type of reulst, ACCEPT, REJECT, UNDETERMINED
 * @return a tm_result struct
*/
tm_result *make_result(confpath *P, enum Result done);

/**
 * @brief given a tm_result struct prints to terminal the configurations
 * and result type after a TM runs on an input
*/
void print_tuple(tm_result *P);

/**
 * @brief checks that an input test case is valid
 * @param chk input test case to be validated
 * @param gam a gamma set since the symbols in the test case should be in gamma of a corresponding TM
 * otherwise will fail
 * @return a true or false if a test case is valid or not
*/
bool valid_string(char *chk, sets *gam);

/**
 * @brief returns the number of steps client wants to run an input
 * obtained from the test case input
 * @param str test case from which number of steps are obtained
 * @return number of steps if given if not -1
*/
int steps(char *str);

/**
 * @brief obtains the input string that is passed to the TM to run from a testcase
 * @param str test case from which input string will be obtained from
 * @return input string for a TM
*/
char *in_string(char *str);

/**
 * @brief runs TM indefinitiely in standard terminal for client
 * to continuously input testcases
*/
void run(TM *M);

/**
 * @brief constructs a TM from a given file that is read from terminal
 * if file doesn't exists creationf fails and client is notified
 * if TM is invalid creation fails and client is notified
 * otherwise TM is created and testcases will be run
 * @return a working TM given correct defintions
*/
TM *tmfromfile();

/**
 * @brief runs TM a TM step by step on some configuration that mimis
 * the infinite tape of a TM
 * @param TM that is running on a configuration 
 * @param curr_conf configuration TM is run on
 * @return new configuration that is formed after running TM on curr_config one step
 * @note confiuration is first obtained on running input string on TM initially
 * on a blank configuration on the tape of the TM
*/
config *simulate_step(TM *M, config *curr_conf);

/**
 * @brief takes in a TM, input string, and number of steps
 * for how long a TM should run on an input acts a Universal TM since it can run an arbitrary TM
 * @param M TM to run on specific input string
 * @param string string used to run TM M
 * @param k number of steps to run TM M
 * @return result of running TM
*/
tm_result *TM_interpreter(TM *M, char *string, int k);


