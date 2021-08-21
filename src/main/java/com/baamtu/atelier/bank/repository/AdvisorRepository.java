package com.baamtu.atelier.bank.repository;

import com.baamtu.atelier.bank.domain.Advisor;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Advisor entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AdvisorRepository extends JpaRepository<Advisor, Long> {}
